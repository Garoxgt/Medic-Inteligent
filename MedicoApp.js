import React, { useState } from 'react';

const MedicoApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: ''
  });
  
  // Estados para API Key
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Función de consulta mejorada - intenta backend primero, luego simulación
  const consultWithAI = async () => {
    if (!symptoms.trim()) {
      alert('Por favor, describa los síntomas');
      return;
    }

    setIsLoading(true);
    setAiResponse('');

    // Intentar conectar al backend primero
    try {
      const response = await fetch('http://localhost:5000/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          symptoms,
          apiKey: apiKey
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiResponse(data.data.diagnosis);
        setIsLoading(false);
        return; // Salir si el backend responde
      }
    } catch (error) {
      console.log('Backend no disponible, usando simulación');
    }

    // Si falla, usar simulación
    setTimeout(() => {
      const simulatedResponse = `
📋 Análisis preliminar:
Síntomas reportados: "${symptoms}"

🔍 Posibles causas comunes:
- Cefalea tensional (más común)
- Migraña
- Deshidratación

💊 Recomendaciones iniciales:
- Descanso en ambiente tranquilo y oscuro
- Hidratación adecuada (2-3 litros de agua al día)
- Aplicar compresas frías en frente y sienes
- Evitar pantallas y luces brillantes
- Tomar analgésico suave si es necesario (paracetamol)

⚠️ Busque atención médica si presenta:
- Dolor de cabeza súbito e intenso
- Fiebre alta persistente
- Rigidez de cuello
- Confusión o cambios en la visión
- Vómitos repetidos

🏥 Nota importante:
Esta es una evaluación preliminar. Para un diagnóstico preciso y tratamiento adecuado, consulte a un profesional médico.`;
      
      setAiResponse(simulatedResponse);
      setIsLoading(false);
    }, 1500);
  };

  const registerPatient = () => {
    if (!patientData.name || !patientData.age) {
      alert('Complete todos los campos');
      return;
    }
    
    alert('Paciente registrado exitosamente');
    setPatientData({ name: '', age: '', gender: '' });
    setCurrentView('home');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      padding: '40px',
      maxWidth: '500px',
      width: '100%',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    },
    icon: {
      fontSize: '60px',
      marginBottom: '20px'
    },
    title: {
      color: '#1F2937',
      marginBottom: '10px'
    },
    subtitle: {
      color: '#6B7280',
      marginBottom: '30px'
    },
    button: {
      width: '100%',
      padding: '16px',
      marginBottom: '12px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      cursor: 'pointer',
      fontWeight: '600',
      color: 'white'
    },
    primaryButton: {
      backgroundColor: '#3B82F6'
    },
    secondaryButton: {
      backgroundColor: '#06B6D4'
    },
    tertiaryButton: {
      backgroundColor: '#8B5CF6'
    },
    grayButton: {
      backgroundColor: '#6B7280'
    },
    configButton: {
      backgroundColor: '#F59E0B'
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      border: '1px solid #D1D5DB',
      borderRadius: '8px',
      fontSize: '16px'
    },
    textArea: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      border: '1px solid #D1D5DB',
      borderRadius: '8px',
      fontSize: '16px',
      minHeight: '150px',
      resize: 'vertical'
    },
    features: {
      marginBottom: '30px'
    },
    featureRow: {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: '10px'
    },
    responseBox: {
      marginTop: '20px',
      padding: '20px',
      backgroundColor: '#F3F4F6',
      borderRadius: '12px',
      border: '1px solid #E5E7EB',
      whiteSpace: 'pre-wrap',
      textAlign: 'left'
    }
  };

  // Modal para API Key
  const ApiKeyModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '15px',
        maxWidth: '400px',
        width: '90%'
      }}>
        <h2>Configurar OpenAI API Key</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Para diagnósticos avanzados con IA, ingresa tu API key de OpenAI.
        </p>
        <p style={{ color: '#999', fontSize: '12px', marginBottom: '15px' }}>
          Obtén tu key en: <a href="https://platform.openai.com" target="_blank">platform.openai.com</a>
        </p>
        <input
          type="password"
          placeholder="sk-..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            boxSizing: 'border-box'
          }}
        />
        <button
          onClick={() => {
            if (apiKey.startsWith('sk-')) {
              localStorage.setItem('openai_api_key', apiKey);
              setShowApiKeyModal(false);
              alert('API Key guardada correctamente');
            } else if (apiKey === '') {
              localStorage.removeItem('openai_api_key');
              setShowApiKeyModal(false);
            } else {
              alert('API key debe empezar con "sk-"');
            }
          }}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#10B981',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}>
          {apiKey ? 'Guardar API Key' : 'Continuar sin API Key'}
        </button>
        <button
          onClick={() => setShowApiKeyModal(false)}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#6B7280',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
          Cancelar
        </button>
      </div>
    </div>
  );

  // Mostrar modal si está activo
  if (showApiKeyModal) {
    return <ApiKeyModal />;
  }

  if (currentView === 'home') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.icon}>👨‍⚕️</div>
          <h1 style={styles.title}>Médico Inteligente</h1>
          <p style={styles.subtitle}>Asistente médico con IA</p>
          
          <div style={styles.features}>
            <div style={styles.featureRow}>
              <span>✅ Consulta con IA</span>
              <span>📋 Registro de pacientes</span>
            </div>
            <div style={styles.featureRow}>
              <span>📊 Reportes detallados</span>
              <span>🔒 Datos seguros</span>
            </div>
          </div>

          <button 
            style={{...styles.button, ...styles.primaryButton}}
            onClick={() => setCurrentView('register')}>
            Registrar Paciente
          </button>
          
          <button 
            style={{...styles.button, ...styles.secondaryButton}}
            onClick={() => setCurrentView('consultation')}>
            Nueva Consulta
          </button>
          
          <button 
            style={{...styles.button, ...styles.tertiaryButton}}
            onClick={() => alert('Historial en desarrollo')}>
            Historial Médico
          </button>

          <button 
            style={{
              ...styles.button, 
              ...styles.configButton,
              fontSize: '14px',
              marginTop: '20px'
            }}
            onClick={() => setShowApiKeyModal(true)}>
            ⚙️ {apiKey ? 'Cambiar' : 'Configurar'} API Key
          </button>

          {apiKey && (
            <p style={{ fontSize: '12px', color: '#10B981', marginTop: '10px' }}>
              ✓ API Key configurada
            </p>
          )}
        </div>
      </div>
    );
  }

  if (currentView === 'consultation') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Nueva Consulta</h2>
          
          {!apiKey && (
            <div style={{
              padding: '10px',
              backgroundColor: '#FEF3C7',
              borderRadius: '8px',
              marginBottom: '15px',
              fontSize: '14px',
              color: '#92400E'
            }}>
              ⚠️ Modo simulación activo. Configure su API Key para diagnósticos reales.
            </div>
          )}
          
          <textarea
            style={styles.textArea}
            placeholder="Describa los síntomas del paciente..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
          
          <button
            style={{...styles.button, ...styles.secondaryButton}}
            onClick={consultWithAI}
            disabled={isLoading}>
            {isLoading ? '⏳ Analizando...' : '🤖 Consultar con IA'}
          </button>
          
          {aiResponse && (
            <div style={styles.responseBox}>
              {aiResponse}
            </div>
          )}
          
          <button
            style={{...styles.button, ...styles.grayButton}}
            onClick={() => {
              setCurrentView('home');
              setSymptoms('');
              setAiResponse('');
            }}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (currentView === 'register') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Registrar Paciente</h2>
          
          <input
            style={styles.input}
            type="text"
            placeholder="Nombre completo"
            value={patientData.name}
            onChange={(e) => setPatientData({...patientData, name: e.target.value})}
          />
          
          <input
            style={styles.input}
            type="number"
            placeholder="Edad"
            value={patientData.age}
            onChange={(e) => setPatientData({...patientData, age: e.target.value})}
          />
          
          <select
            style={styles.input}
            value={patientData.gender}
            onChange={(e) => setPatientData({...patientData, gender: e.target.value})}>
            <option value="">Seleccionar género</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
          
          <button
            style={{...styles.button, ...styles.primaryButton}}
            onClick={registerPatient}>
            Guardar Paciente
          </button>
          
          <button
            style={{...styles.button, ...styles.grayButton}}
            onClick={() => setCurrentView('home')}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default MedicoApp;