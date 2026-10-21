import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const ResetPassword = () => {
    // Leemos el email y el token que vienen en la URL
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    const [nuevaPassword, setNuevaPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación rápida en el front
        if (nuevaPassword !== confirmarPassword) {
            Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5168/api/auth/restablecer-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: email, 
                    token: token, 
                    nuevaPassword: nuevaPassword 
                }) 
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: data.mensaje || 'Contraseña actualizada correctamente.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    navigate('/login'); // Lo mandamos a iniciar sesión
                });
            } else {
                Swal.fire('Error', data.error || 'El enlace es inválido o expiró.', 'error');
            }
        } catch (error) {
            Swal.fire('Error de conexión', 'No se pudo conectar con el servidor', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Si alguien entra a la ruta sin token o email, le avisamos
    if (!email || !token) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
                <h2>Enlace inválido</h2>
                <p>Faltan datos en la URL. Por favor, vuelve a solicitar el cambio de contraseña.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <h2>Crear nueva contraseña</h2>
            <p>Ingresa tu nueva contraseña para la cuenta <b>{email}</b></p>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="password" 
                    placeholder="Nueva contraseña" 
                    value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '16px' }}
                />

                <input 
                    type="password" 
                    placeholder="Confirmar contraseña" 
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '16px' }}
                />
                
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        padding: '10px', 
                        fontSize: '16px', 
                        backgroundColor: loading ? '#ccc' : '#28a745', 
                        color: 'white', 
                        border: 'none', 
                        cursor: loading ? 'not-allowed' : 'pointer' 
                    }}
                >
                    {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
                </button>
            </form>
        </div>
    );
};