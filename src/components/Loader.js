import React from 'react';
import { Circles } from  'react-loader-spinner';

const Loader = () => {
  return (
    <div className="flex flex-wrap justify-center content-center dark:bg-slate-950 min-h-screen">
        <Circles
          height="100"
          width="100"
          color="#38bdf8"
          ariaLabel="audio-loading"
          wrapperStyle={{}}
          wrapperClass="wrapper-class"
          visible={true}
        />
    </div>
  )
}

export default Loader;