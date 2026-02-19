export function Card({ children, title, subtitle, className = '', style = {} }) {
    return (
        <div className={`card ${className}`} style={style}>
            {(title || subtitle) && (
                <div style={{ marginBottom: '1.5rem' }}>
                    {title && <h3 style={{ margin: 0 }}>{title}</h3>}
                    {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{subtitle}</p>}
                </div>
            )}
            {children}
        </div>
    );
}

export function Button({ children, variant = 'primary', onClick, type = 'button', className = '', style = {}, disabled = false }) {
    return (
        <button
            type={type}
            className={`btn btn-${variant} ${className}`}
            onClick={onClick}
            style={{ opacity: disabled ? 0.7 : 1, cursor: disabled ? 'not-allowed' : 'pointer', ...style }}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export function Input({ label, type = 'text', value, onChange, placeholder, name, required = false, style = {} }) {
    return (
        <div className="input-group" style={style}>
            {label && <label className="input-label">{label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}</label>}
            <input
                type={type}
                name={name}
                className="input-field"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
}

export function Select({ label, value, onChange, options, name, required = false }) {
    return (
        <div className="input-group">
            {label && <label className="input-label">{label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}</label>}
            <div style={{ position: 'relative' }}>
                <select
                    name={name}
                    className="input-field"
                    value={value}
                    onChange={onChange}
                    required={required}
                    style={{ appearance: 'none', cursor: 'pointer' }}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    ▼
                </div>
            </div>
        </div>
    );
}
