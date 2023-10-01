import { Outlet } from 'react-router-dom'
import { DefaultNavBar } from '../containers/default-nav-bar'

export const DefaultLayout = () => {
    return (
        <div className='drawer lg:drawer-open'>
            <input id='my-drawer-2' type='checkbox' className='drawer-toggle' />

            <div className='drawer-content flex flex-col items-center justify-center py-32 px-5'>
                <Outlet />
            </div>

            <div className='drawer-side'>
                <label
                    htmlFor='my-drawer-2'
                    aria-label='close sidebar'
                    className='drawer-overlay'
                ></label>
                <DefaultNavBar />
            </div>
        </div>
    )
}
