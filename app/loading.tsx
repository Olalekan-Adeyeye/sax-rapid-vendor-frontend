export default function Loading() {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-white transition-opacity duration-500 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col items-center">
        {/* Animated Rings */}
        <div className="relative w-28 h-28 mb-8">
          {/* Inner pulsating circle */}
          <div className="absolute inset-8 bg-gold/10 rounded-full animate-pulse"></div>
          
          {/* Main outer ring */}
          <div className="absolute inset-0 border-[3px] border-gold/10 rounded-full"></div>
          <div className="absolute inset-0 border-[3px] border-gold border-t-transparent rounded-full animate-[spin_1.2s_cubic_bezier(0.76,0.35,0.2,0.7)_infinite]"></div>
          
          {/* Mid ring */}
          <div className="absolute inset-4 border-2 border-black/5 rounded-full"></div>
          <div className="absolute inset-4 border-2 border-black border-b-transparent rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
          
          {/* Smallest inner ring */}
          <div className="absolute inset-10 border border-gold/20 rounded-full animate-pulse"></div>
        </div>

        {/* Branding */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-[0.3em] text-black mb-3 uppercase drop-shadow-sm">
            SAX<span className="text-gold">-</span>RAPID
          </h1>
          <div className="flex items-center justify-center space-x-3">
            <div className="h-px w-8 bg-linear-to-r from-transparent to-gray-300"></div>
            <p className="text-[10px] font-bold text-gray-400 tracking-[0.4em] uppercase">
              Loading Excellence
            </p>
            <div className="h-px w-8 bg-linear-to-l from-transparent to-gray-300"></div>
          </div>
        </div>
      </div>

      {/* Background radial glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}
