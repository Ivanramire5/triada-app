import { useState } from 'react';
import Swal from 'sweetalert2';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5168/api/auth/recuperar-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }) 
            });

            if (response.ok) {
                Swal.fire({
                    title: '¡Correo enviado!',
                    text: 'Si el correo existe en nuestro sistema, recibirás un enlace de recuperación en breve.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6'
                });
                setEmail(''); // Limpiamos el input
            } else {
                Swal.fire('Error', 'Hubo un problema al procesar la solicitud', 'error');
            }
        } catch (error) {
            Swal.fire('Error de conexión', 'No se pudo conectar con el servidor', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <h2>Recuperar Contraseña</h2>
            <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="email" 
                    placeholder="tu-correo@empresa.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '16px' }}
                />
                
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        padding: '10px', 
                        fontSize: '16px', 
                        backgroundColor: loading ? '#ccc' : '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        cursor: loading ? 'not-allowed' : 'pointer' 
                    }}
                >
                    {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Volver al inicio de sesión</a>
            </div>
        </div>
    );
};