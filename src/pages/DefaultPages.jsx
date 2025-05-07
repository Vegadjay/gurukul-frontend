import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { X, QrCode, ArrowRight } from "lucide-react";

const DefaultPage = () => {
    const [showQRCode, setShowQRCode] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [animateTitle, setAnimateTitle] = useState(false);

    // Split "ACCESS" and "DENIED" for better control of spacing
    const accessText = "ACCESS";
    const deniedText = "DENIED";

    // Handle animations on mount
    useEffect(() => {
        setMounted(true);
        setTimeout(() => setAnimateTitle(true), 800);
    }, []);

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
            {/* Full-screen background image */}
            <div className={`absolute inset-0 w-full h-full bg-cover bg-center z-0 transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: "url('/background/Notfound.png')", backgroundSize: "cover", backgroundPosition: "center" }} />

            {/* Floating clouds animation */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-[5%] opacity-70 animate-float-slow"><div className="w-24 h-12 bg-amber-100 rounded-full"></div></div>
                <div className="absolute top-20 right-[10%] opacity-70 animate-float-medium"><div className="w-32 h-16 bg-amber-100 rounded-full"></div></div>
                <div className="absolute top-40 left-[25%] opacity-70 animate-float-fast"><div className="w-20 h-10 bg-amber-100 rounded-full"></div></div>
            </div>

            <div className="relative z-10 w-full max-w-2xl mx-auto text-center p-6">
                {/* "ACCESS DENIED" text with enhanced spacing */}
                <h1 className={`inline-block whitespace-nowrap font-poppins text-5xl sm:text-6xl font-bold text-red-600 tracking-wide mb-6 transition-all duration-1000 ${animateTitle ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ textShadow: "2px 2px 4px rgba(139, 69, 19, 0.3)" }}>
                    <div className="flex justify-center items-center">
                        {/* First part: ACCESS */}
                        <div className="mr-6">
                            {accessText.split('').map((char, index) => (
                                <span key={`access-${index}`} className="inline-block transition-transform duration-200 hover:text-red-700 hover:scale-110 hover:rotate-6">{char}</span>
                            ))}
                        </div>

                        {/* Second part: DENIED */}
                        <div>
                            {deniedText.split('').map((char, index) => (
                                <span key={`denied-${index}`} className="inline-block transition-transform duration-200 hover:text-red-700 hover:scale-110 hover:rotate-6">{char}</span>
                            ))}
                        </div>
                    </div>
                </h1>

                <p className={`font-poppins text-lg text-amber-800 mb-8 transition-all duration-1000 delay-100 ${animateTitle ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    Please complete payment to continue
                </p>

                <Button onClick={() => setShowQRCode(true)} className={`font-poppins px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-lg transition-all duration-1000 flex items-center justify-center gap-2 mx-auto hover:scale-105 ${animateTitle ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    Complete Payment <ArrowRight size={18} />
                </Button>
            </div>

            {showQRCode && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={(e) => e.target === e.currentTarget && setShowQRCode(false)}>
                    <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-xl p-6 max-w-sm w-full mx-4 relative shadow-2xl animate-scaleIn border-2 border-amber-200">
                        <button onClick={() => setShowQRCode(false)} className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full transition-colors hover:bg-red-600 w-8 h-8 flex items-center justify-center shadow-lg">
                            <X size={20} />
                        </button>

                        <div className="flex items-center justify-center gap-2 mb-5">
                            <QrCode size={24} className="text-amber-800" />
                            <h3 className="font-poppins text-2xl font-bold text-center text-amber-900">Complete Payment</h3>
                        </div>

                        <div className="flex justify-center mb-5">
                            <div className="w-64 h-64 bg-white flex items-center justify-center border-2 border-amber-200 rounded-lg shadow-lg p-3 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-amber-50 opacity-50"></div>
                                <div className="relative w-full h-full bg-white p-2 rounded-md">
                                    <img src="/qr/qr.jpeg" alt="Payment QR Code" className="w-full h-full object-contain" />
                                    <div className="absolute top-0 left-0 w-full h-2 bg-blue-400 opacity-70 animate-scanning"></div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="font-poppins text-sm text-center text-amber-800 font-medium">
                                Scan this QR code with your payment app
                            </p>

                            <div className="font-poppins text-xs text-center text-amber-700 bg-amber-100 p-3 rounded-lg border border-amber-200">
                                Your session will expire in <span className="font-bold">15:00</span> minutes
                            </div>

                            <Button className="font-poppins w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-all duration-300 hover:shadow-lg">
                                I've completed payment
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS animations */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
                
                @keyframes float-slow { 0% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-20px) translateX(20px); } 100% { transform: translateY(0) translateX(0); } }
                @keyframes float-medium { 0% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-15px) translateX(-15px); } 100% { transform: translateY(0) translateX(0); } }
                @keyframes float-fast { 0% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-10px) translateX(10px); } 100% { transform: translateY(0) translateX(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                @keyframes scanning { 0% { transform: translateY(-100%); } 100% { transform: translateY(2000%); } }
                
                .animate-float-slow { animation: float-slow 15s ease-in-out infinite; }
                .animate-float-medium { animation: float-medium 12s ease-in-out infinite; }
                .animate-float-fast { animation: float-fast 10s ease-in-out infinite; }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
                .animate-scaleIn { animation: scaleIn 0.4s ease-out forwards; }
                .animate-scanning { animation: scanning 2s linear infinite; }
            `}</style>
        </div>
    );
};

export default DefaultPage;