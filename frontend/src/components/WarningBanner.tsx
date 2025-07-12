import React, { useEffect, useState } from 'react';

interface WarningBannerProps {
    anomalies: string[];
    rewindVid?: boolean;
    doGesture?: boolean;
}

const WarningBanner: React.FC<WarningBannerProps> = ({ anomalies, rewindVid, doGesture}) => {
    const [currentAnomalies, setCurrentAnomalies] = useState<string[]>(anomalies);

    useEffect(() => {
        setCurrentAnomalies(anomalies);
    }, [anomalies]);

    // Any additional logic based on anomalies can go here

    return (
        <div
            className='shadow-2xl'
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(70,50,0,0.85)',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto',
                borderRadius: '12px 12px 0 0',
                transition: 'background 0.2s',
               minWidth: 420,
            }}
        >
            <div
                className='shadow-2xl'
                style={{
                    background: 'rgba(255, 255, 255, 1)',
                    borderRadius: 16,
                    padding: '32px 32px 24px 32px',
                    boxShadow: '0 4px 32px rgba(30,41,59,0.10)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                   maxWidth: 400,
                   minWidth: 340,
                   margin: '0 auto',
                }}
            >
                <div
                    style={{
                        // background: '#fbbf24',
                        borderRadius: '50%',
                        width: 150,
                        height: 150,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 18,
                        // boxShadow: '0 2px 12px rgba(30,41,59,0.10)',
                    }}
                >
                    {/* Warning SVG icon */}
                    {rewindVid && (<svg
                        width="140"
                        height="140"
                        viewBox="0 0 156.262 144.407"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g transform="matrix(0.99073487,0,0,0.99073487,186.61494,2.4370252)">
                            <path
                                d="m -109.16602,7.2265625 c -0.13666,0.0017 -0.27279,0.017412 -0.40625,0.046875 -3.19494,0.029452 -6.17603,1.6944891 -7.78515,4.4824215 l -31.25,54.126953 -31.25,54.126958 h 0.002 c -3.41988,5.92217 1.01692,13.60908 7.85547,13.60937 h 62.5 62.501953 c 6.838552,-3.2e-4 11.277321,-7.68721 7.857422,-13.60937 l -31.25,-54.126958 -31.251955,-54.126953 c -1.46518,-2.5386342 -4.07917,-4.1634136 -6.97851,-4.4492184 -0.14501,-0.042788 -0.2944,-0.068998 -0.44532,-0.078125 h -0.004 c -0.0312,-0.00138 -0.0625,-0.00203 -0.0937,-0.00195 z"
                                style={{ fill: "#000" }}
                            />
                            <path
                                d="m -109.16545,9.2265625 c -2.63992,-0.1247523 -5.13786,1.2403375 -6.45899,3.5292965 l -31.25,54.126953 -31.25,54.126958 c -2.67464,4.63164 0.77657,10.60914 6.125,10.60937 h 62.5 62.50196 c 5.34844,-2.5e-4 8.79965,-5.97774 6.125,-10.60937 l -31.25,-54.126958 -31.25196,-54.126953 c -1.20213,-2.082863 -3.38689,-3.4150037 -5.78906,-3.5292965 h -0.002 z"
                                style={{ fill: "#fff" }}
                            />
                            <path
                                d="m -109.25919,11.224609 c -1.89626,-0.08961 -3.68385,0.887082 -4.63282,2.53125 l -31.25,54.126953 -31.25,54.126958 c -1.95283,3.38168 0.48755,7.6092 4.39258,7.60937 h 62.5 62.50196 c 3.905026,-1.8e-4 6.345394,-4.2277 4.39257,-7.60937 l -31.25,-54.126958 -31.25195,-54.126953 c -0.86311,-1.495461 -2.42763,-2.44919 -4.15234,-2.53125 z"
                                style={{ fill: "#000" }}
                            />
                            <path
                                d="m -46.997381,124.54655 -62.501079,0 -62.50108,0 31.25054,-54.127524 31.25054,-54.127522 31.25054,54.127521 z"
                                style={{ fill: "#df0000" }}
                            />
                            <g transform="translate(-188.06236)">
                                <circle
                                    r="8.8173475"
                                    cy="111.11701"
                                    cx="78.564362"
                                    style={{ fill: "#000" }}
                                />
                                <path
                                    d="m 78.564453,42.955078 c -4.869714,-5.59e-4 -8.817839,3.946692 -8.818359,8.816406 3.15625,37.460938 0,0 3.15625,37.460938 8.93e-4,3.126411 2.535698,5.660342 5.662109,5.660156 3.126411,1.86e-4 5.661216,-2.533745 5.662109,-5.660156 3.154297,-37.460938 0,0 3.154297,-37.460938 -5.2e-4,-4.868951 -3.947455,-8.815886 -8.816406,-8.816406 z"
                                    style={{ fill: "#000" }}
                                />
                            </g>
                        </g>
                    </svg>)}
                    {doGesture && !rewindVid && (<img src="https://em-content.zobj.net/source/microsoft/309/thumbs-up_1f44d.png" className="w-auto h-full" />)}
                </div>
                <div
                    style={{
                        color: '#1e293b',
                        background: '#fbbf24',
                        padding: '14px 28px',
                        borderRadius: 10,
                        fontWeight: 1000,
                        fontSize: 21,
                        boxShadow: '0 30px 16px rgba(30,41,59,0.13)',
                        textAlign: 'center',
                        letterSpacing: 0.1,
                        maxWidth: 340,
                        lineHeight: 1.2,
                        border: '1px solid #f59e42',

                    }}
                >
                    {rewindVid
                        ? (
                            <span style={{ fontWeight: 500, fontSize: 15 }}>
                                {currentAnomalies.includes("voiceDetection") ? (
                                    <div style={{ marginBottom: 6 }}>
                                        <strong>Don't speak!!</strong>
                                    </div>
                                ) : null}
                                {currentAnomalies.includes("faceCountDetection") ? (
                                    <div style={{ marginBottom: 6 }}>
                                        <strong>Only one face!!</strong>
                                    </div>
                                ) : null}
                                {currentAnomalies.includes("blurDetection") ? (
                                    <div style={{ marginBottom: 6 }}>
                                        <strong>Keep your camera clear!!</strong>
                                    </div>
                                ) : null}
                                {currentAnomalies.includes("focus") ? (
                                    <div style={{ marginBottom: 6 }}>
                                        <strong>Stay focused!!</strong>
                                    </div>
                                ) : null}
                            </span>
                        )
                        : (
                            <span style={{ fontWeight: 500, fontSize: 15 }}>
                                {'Gesture Needed!'}
                                <br />
                                <>
                                    <span>
                                        To continue watching your lesson, please show a <strong>thumbs up gesture</strong> in front of your camera.
                                    </span>
                                    <br />
                                    <span style={{ fontWeight: 200, fontSize: 14 }}>
                                        This helps us know you’re present and engaged. Once we detect your gesture, the video will resume automatically.
                                    </span>
                                </>
                            </span>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default WarningBanner;