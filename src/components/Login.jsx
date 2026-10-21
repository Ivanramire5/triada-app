import { useState } from 'react';
import Swal from 'sweetalert2';

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Hacemos la petición al nuevo endpoint de C#
            const response = await fetch('http://localhost:5168/api/auth/login', {
                method: 'POST',
                credentials: 'include', // <-- Clave para que el navegador acepte y guarde la cookie de sesión
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }) 
            });

            if (response.ok) {
                // Guardamos únicamente el nombre o correo del usuario para la UI
                localStorage.setItem('userName', email); 
                
                // Le avisamos a App.jsx que ya podemos entrar
                onLoginSuccess();

                window.location.href = '/';
                
                Swal.fire({
                    title: '¡Bienvenido!',
                    text: 'Sesión iniciada correctamente',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire('Error', 'Credenciales inválidas', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            height: '100vh', backgroundColor: '#FAF3EE'
        }}>
            <div style={{
                backgroundColor: 'white', padding: '40px', borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px',
                borderTop: '5px solid #134B68'
            }}>
                <h2 style={{ textAlign: 'center', color: '#134B68', marginBottom: '20px' }}>
                    Triada <br/> <span style={{ fontSize: '1rem', color: '#7A8B99' }}>Gestión de Inventario</span>
                </h2>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#2C3E50', fontWeight: 'bold' }}>Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                            placeholder="admin@triada.com"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#2C3E50', fontWeight: 'bold' }}>Contraseña</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            backgroundColor: '#C2410C', color: 'white', padding: '12px', border: 'none',
                            borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '10px'
                        }}
                    >
                        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                    </button>
                    {/* ENLACE DE RECUPERACIÓN DE CONTRASEÑA */}
                    <div style={{ textAlign: 'center', marginTop: '10px' }}>
                        <a 
                            href="/forgot-password" 
                            style={{ color: '#134B68', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}
                        >
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}