import React, { useEffect, useState } from 'react'
import {FaMoon} from 'react-icons/fa';
import {BsSunFill} from 'react-icons/bs';

const ThemeSwitch = () => {
  // State to track the current theme ('dark' or 'light')
  const [theme, setTheme] = useState(null);

    // Detect the user's preferred color scheme (dark/light) and set the initial theme
    useEffect(() => {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }, []);

    // Update the HTML element class based on the theme for CSS styling
    useEffect(() => {
      theme === 'dark'? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
    }, [theme])

    // Handle toggling between 'dark' and 'light' themes
    const handleThemeSwitch = () => setTheme(theme === 'dark' ? 'light':'dark') 

  return (
    <div>
      <button onClick={handleThemeSwitch}> {theme === 'dark'? <FaMoon/> : <BsSunFill />} </button>      
    </div>
  )
}

export default ThemeSwitch;
