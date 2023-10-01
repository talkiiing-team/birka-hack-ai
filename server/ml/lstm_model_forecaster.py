import json

import pandas as pd
import pickle, dill
import copy
import numpy as np
from tqdm.auto import tqdm

tqdm.pandas()
model = dill.load(open("models/model_rnn.dill", "rb"))

# train_df = pd.read_csv("train_dataset_luggage/bsm_data_train.csv")
enc, cities_names = pickle.load(open("models/encoder_and_names.pkl", "rb"))

def by_interval_get_date_mapper(interval, delta):
    """Получаем функцию для получения строкового представления по интервалу"""

    def get_string_from_date(date):
        """Получаем строку по которой можно агрегировать"""
        year = date.year
        month = date.month
        day = date.day
        hour = date.hour
        minute = date.minute

        full_minutes = hour * 60 + minute
        agg_value = (full_minutes + delta) // interval

        return "_".join([str(i) for i in [year, month, day, agg_value]])

    return get_string_from_date


def date_to_str(date):
    year = date.year
    month = date.month
    day = date.day
    hour = date.hour
    minute = date.minute

    return "_".join([str(i) for i in [year, month, day, hour, minute]])


def get_statistics(data):
    mean = data.mean()
    std = data.std()

    percentile_25 = np.percentile(data, 25)
    percentile_75 = np.percentile(data, 75)

    return ("mean", mean), ("std", std),("percentile_25", percentile_25), ("percentile_75", percentile_75)

def get_predict_on_future(df):
    use_extra_features = True

    try:
        fligth_rasp = pd.read_csv("flight_rasp_data.csv")
        fligth_rasp["datetime"] = pd.to_datetime(fligth_rasp.t_st)
        fligth_rasp["string_datetime"] = fligth_rasp.datetime.progress_apply(by_interval_get_date_mapper(1, 0))
        df = df.merge(fligth_rasp, left_on="i_id", right_on="i_id")
    except Exception:
        use_extra_features = False


    df["datetime"] = pd.to_datetime(df["DateEvent"])
    df = df.sort_values(by="datetime")
    df = df.iloc[-50000:]

    df["datetime"] = pd.to_datetime(df.MessageReceivedDate)
    df["string_datetime"] = df.datetime.progress_apply(by_interval_get_date_mapper(1, 0))


    res = {}
    results = []

    for ind, data in tqdm(df.groupby("string_datetime")):
        res["len"] = len(data)

        data["hour"] = data.datetime.apply(lambda x: x.hour)
        data["minute"] = data.datetime.apply(lambda x: x.minute)
        data["year"] = data.datetime.apply(lambda x: x.year)
        data["month"] = data.datetime.apply(lambda x: x.month)
        data["day"] = data.datetime.apply(lambda x: x.day)

        res["day"] = data["day"].iloc[0]
        res["month"] = data["month"].iloc[0]
        res["hour"] = data["hour"].iloc[0]
        res["minute"] = data["minute"].median()

        if use_extra_features:
            count_cities = enc.transform([[i] for i in data["m_city_rus2"]]).toarray().sum(axis=0)

            for name, count_city in zip(cities_names, count_cities):
                res[f"count_city_{name}"] = count_city

            # for ind, i in enumerate(sorted(list(Counter(data["m_city_rus2"]).items()), key = lambda x: -x[1])[:5]):
            #     res[f"city_{ind}"] = i[0]

            delta_event_db = (pd.to_datetime(data["DateEvent"]) - pd.to_datetime(data["MessageReceivedDate"]))

            res["mean_delta_bsm_database"] = delta_event_db.mean().total_seconds()
            res["std_delta_bsm_database"] = delta_event_db.std().total_seconds()

            res["count_transfer"] = (data.local_or_transfer == "T").sum()
            res["config_sum"] = data.config.sum()

            for name, val in get_statistics(data["config"]):
                res[f"config_{name}"] = val

            for name, val in get_statistics((data.departure_terminal == "C").astype("int")):
                res[f"dep_terminal_{name}"] = val

            for name, val in get_statistics((data.checkin_terminal == "C").astype("int")):
                res[f"check_terminal_{name}"] = val

            data["t_st"] = pd.to_datetime(data["t_st"])
            data["DateEvent"] = pd.to_datetime(data["DateEvent"])
            deltatime = data["t_st"] - data["DateEvent"]

            res["sum_arrive_to_event"] = deltatime.sum().total_seconds()
            res["std_arrive_to_event"] = deltatime.std().total_seconds()
            res["mean_arrive_to_event"] = deltatime.mean().total_seconds()
            res["tst_percentile_25"] = np.percentile(deltatime, 25) / np.timedelta64(1, 's')
            res["tst_percentile_75"] = np.percentile(deltatime, 75) / np.timedelta64(1, 's')

            res["tst_day"] = data["day"].iloc[0]
            res["tst_month"] = data["month"].iloc[0]
            res["tst_hour"] = data["hour"].iloc[0]
            res["tst_minute"] = data["minute"].median()

        results.append(copy.deepcopy(res))

    df = pd.DataFrame(results)

    df.to_csv("example_csv.csv")

    sample = df[-20:]

    result = model.forward(sample)
    full_result = df.len.tolist() + result
    mask = [False] * (len(full_result) - 100) + [True] * 100
    dates = list(zip(df.month, df.day, df.hour, df.minute))
    last_time = list(dates[-1])
    new_dates = []

    for i in range(100):
        last_time[-1] += 1
        new_dates.append(last_time)
    dates = dates + new_dates

    plot_cities = {"cities_count": [], "cities_names": []}
    if use_extra_features:
        res_cities_names = [i[i.index("x0_") + 3:] for i in df.columns if "count_city" in i]
        cols = [i for i in df.columns if "count_city" in i]
        plot_cities = {
            "cities_count": df[cols].sum(axis=0).values.tolist(),
            "cities_names": res_cities_names
        }

    res =  {"predict":
        {
            "target_count": full_result,
            "dates": dates,
            "is_new": mask
        },
        "sum_count_new_bsm": int(np.sum(result)),
        "mean_count_new_bsm": np.median(result),
        "plot_cities": plot_cities
    }

    json.dump(res, open("example_output.json", "w"), indent=4)
    return res
