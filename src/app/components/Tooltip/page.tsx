import React from "react";

const Tooltip: React.FC = () => {
    return (
        <div className="animate-bounce absolute z-20 left-1/2">
            <div className="relative cursor-pointer">
                <section className="inline-flex">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 translate-y-[33%] px-4 py-3 text-white font-extrabold tracking-wider bg-duoGreen-default rounded-2xl border-2 border-white uppercase text-center">
                        <div>START</div>
                    </div>
                    <div className="absolute left-1/2 top-full transform -translate-x-1/2 -translate-y-[100%] rotate-45 bg-duoGreen-default h-5 w-5 origin-center text-transparent border-b-2 border-r-2 border-white rounded-sm ">
                        <div className="origin-center"></div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Tooltip;
