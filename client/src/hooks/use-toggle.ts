import { useState } from 'react'

export const useToggle = (defaultValue = false) => {
    const [isToggled, setIsToggled] = useState(defaultValue)

    const toggle = () => setIsToggled(isToggled => !isToggled)

    return { isToggled, toggle }
}
