import React from 'react';
import { ICONS } from './Icons';

const GameRules = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(5px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
    };

    const modalStyle = {
        background: 'var(--color-bg-panel, #1a1a1d)',
        border: '1px solid var(--color-primary, #d4a017)',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 30px rgba(0,0,0,0.8), 0 0 10px rgba(212, 160, 23, 0.2)',
        color: 'var(--color-text-main, #e0e0e0)',
        fontFamily: 'var(--font-ui, sans-serif)',
        animation: 'fadeIn 0.3s ease-out'
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0,0,0,0.2)'
    };

    const contentStyle = {
        padding: '20px',
        overflowY: 'auto',
        lineHeight: '1.6',
        fontSize: '0.95rem'
    };

    const sectionStyle = {
        marginBottom: '25px',
        paddingBottom: '15px',
        borderBottom: '1px dashed rgba(255,255,255,0.05)'
    };

    const h3Style = {
        color: 'var(--color-primary, #d4a017)',
        marginBottom: '10px',
        fontSize: '1.2rem',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    };

    const strongStyle = {
        color: '#fff',
        fontWeight: 'bold'
    };

    const iconInlineStyle = {
        display: 'inline-flex',
        verticalAlign: 'text-bottom',
        margin: '0 4px',
        color: 'var(--color-primary)',
        transform: 'scale(0.8)'
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
                <div style={headerStyle}>
                    <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--color-primary)' }}>AKTA SPRAWY: ZASADY GRY</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#888',
                            cursor: 'pointer',
                            fontSize: '1.5rem',
                            padding: '5px'
                        }}
                    >
                        ✕
                    </button>
                </div>

                <div style={contentStyle} className="custom-scrollbar">
                    <div style={sectionStyle}>
                        <h3 style={h3Style}>Cel Gry</h3>
                        <p>
                            Bohater, którego wizerunek widnieje na ukrytej karcie, jest poszukiwanym przez wszystkich przestępcą!
                            System losuje i rozdaje karty. Karta przestępcy jest ukryta przez system.
                            Pozostałe karty system rozdaje graczom. Twoje karty są widoczne tylko dla Ciebie w sekcji "Twój Zestaw".
                        </p>
                    </div>

                    <div style={sectionStyle}>
                        <h3 style={h3Style}>Przebieg Rozgrywki</h3>
                        <p>
                            Wszyscy wykonują swoje ruchy zgodnie z kierunkiem wskazówek zegara (system pilnuje kolejności).
                            Każdy gracz stara się odkryć, kto jest przestępcą, zbierając informacje na drodze dochodzenia.
                        </p>
                        <p style={{ marginTop: '10px' }}>
                            W czasie swojego ruchu gracz może wykonać tylko jedną akcję: <span style={strongStyle}>ŚLEDZTWO <ICONS.Search style={iconInlineStyle} /></span>, <span style={strongStyle}>PRZESŁUCHANIE <ICONS.Bulb style={iconInlineStyle} /></span> lub <span style={strongStyle}>OSKARŻENIE <ICONS.Badge style={iconInlineStyle} /></span>.
                        </p>
                    </div>

                    <div style={sectionStyle}>
                        <h3 style={h3Style}>Opis Akcji</h3>

                        <div style={{ marginBottom: '15px' }}>
                            <p><span style={strongStyle}>ŚLEDZTWO <ICONS.Search style={iconInlineStyle} /></span>: Wybierasz jeden z dostępnych symboli i pytasz pozostałych, czy widnieje on na ich kartach. Jeśli pytani mają dany symbol, system automatycznie udzieli odpowiedzi (podświetli/oznaczy graczy, którzy mają dany symbol).</p>
                            <p style={{ fontSize: '0.85em', color: '#aaa', fontStyle: 'italic' }}>Ważne: Gracze nie mówią, ile ikonek takiego samego symbolu mają na swoich kartach.</p>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <p><span style={strongStyle}>PRZESŁUCHANIE <ICONS.Bulb style={iconInlineStyle} /></span>: Wybierasz jednego z uczestników rozgrywki i pytasz, ile ikonek danego symbolu ma on na swoich kartach. Uczestnik ten (lub system w jego imieniu) podaje dokładną liczbę ikonek danego symbolu.</p>
                        </div>

                        <div>
                            <p><span style={strongStyle}>OSKARŻENIE <ICONS.Badge style={iconInlineStyle} /></span>: Wskazujesz postać, która według Ciebie jest przestępcą. System weryfikuje oskarżenie.</p>
                            <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                                <li style={{ marginBottom: '5px' }}>Jeśli <strong>trafisz</strong>: Wygrywasz grę! Karta przestępcy zostaje odsłonięta.</li>
                                <li>Jeśli <strong>się pomylisz</strong>: Tracisz możliwość wykonywania akcji do końca gry (możesz tylko odpowiadać na pytania innych).</li>
                            </ul>
                        </div>
                    </div>

                    <div style={sectionStyle}>
                        <h3 style={h3Style}>Arkusz Dochodzenia</h3>
                        <p>
                            Możesz używać cyfrowego Arkusza Dochodzenia widocznego na ekranie.
                            <br />
                            Górna część pozwala notować, kto ma jaki symbol. Dolna część służy do wykluczania podejrzanych.
                        </p>
                    </div>
                </div>

                <div style={{ padding: '15px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'right' }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 24px',
                            background: 'var(--color-primary)',
                            color: '#111',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        ZROZUMIAŁEM
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameRules;
