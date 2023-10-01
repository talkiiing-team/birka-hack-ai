import pickle, dill
import pandas as pd
import copy
import numpy as np
from lstm_model_forecaster import get_predict_on_future


df = pd.read_csv("train_dataset_luggage/bsm_data_train.csv")
res = get_predict_on_future(df)


# import json
# json.dump(res, open("example_answer.json", "w"), indent=4)
#
# indexes_1 = [ind for ind, i in enumerate(res["predict"]["is_new"]) if i]
# indexes_2 = [ind for ind, i in enumerate(res["predict"]["is_new"]) if not i]
#
# plt.plot(indexes_1, np.array(res["predict"]["target_count"])[indexes_1])
# plt.plot(indexes_2, np.array(res["predict"]["target_count"])[indexes_2], c='r')
# plt.show()

# #%%
# import pandas as pd
# from predict_count_bsm import get_predict_on_future
# import json
#
# df = pd.read_csv("train_dataset_luggage/bsm_data_train.csv").iloc[:1000]
# fligth_rasp = pd.read_csv("train_dataset_luggage/flight_rasp_data.csv")
# arrival_profile_data = pd.read_csv("train_dataset_luggage/arrival_profile_data.csv")
# arrival_profile_value = pd.read_csv("train_dataset_luggage/arrival_profile_value.csv")
#
# res = get_predict_on_future(df, fligth_rasp, arrival_profile_data, arrival_profile_value)
# json.dump(res, open("output"))
