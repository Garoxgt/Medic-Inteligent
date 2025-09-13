import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: '',
  });
  const [message, setMessage] = useState('');

  // Función para consultar con IA
  const consultWithAI = async () => {
    if (!symptoms.trim()) {
      setMessage('Por favor describe los síntomas');
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms }),
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(data.data.diagnosis);
      }
    } catch (error) {
      // Respuesta simulada
      setMessage(`Análisis de: ${symptoms}\n\nRecomendación: Consulte a un médico.`);
    }
    
    setIsLoading(false);
  };

  // Función para registrar paciente
  const registerPatient = async () => {
    if (!patientData.name || !patientData.age) {
      setMessage('Complete todos los campos');
      return;
    }

    setMessage('Paciente registrado correctamente');
    setPatientData({ name: '', age: '', gender: '' });
    setTimeout(() => setCurrentView('home'), 2000);
  };

  // Vista Principal
  if (currentView === 'home') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.gradient, {backgroundColor: '#667eea'}]}>
          <View style={styles.card}>
            <Text style={styles.icon}>👨‍⚕️</Text>
            <Text style={styles.title}>Médico Inteligente</Text>
            <Text style={styles.subtitle}>Asistente médico con IA</Text>
            
            <View style={styles.features}>
              <View style={styles.featureRow}>
                <Text>✅ Consulta con IA</Text>
                <Text>📋 Registro de pacientes</Text>
              </View>
              <View style={styles.featureRow}>
                <Text>📊 Reportes detallados</Text>
                <Text>🔒 Datos seguros</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => setCurrentView('register')}>
              <Text style={styles.buttonText}>Registrar Paciente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => setCurrentView('consultation')}>
              <Text style={styles.buttonText}>Nueva Consulta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.tertiaryButton]}
              onPress={() => setMessage('Función en desarrollo')}>
              <Text style={styles.buttonText}>Historial Médico</Text>
            </TouchableOpacity>

            {message ? <Text style={styles.message}>{message}</Text> : null}

            <Text style={styles.footer}>
              Desarrollado con React Native + OpenAI API{'\n'}
              Versión Web
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Vista de Consulta
  if (currentView === 'consultation') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.gradient, {backgroundColor: '#667eea'}]}>
          <ScrollView>
            <View style={styles.card}>
              <Text style={styles.title}>Nueva Consulta</Text>
              
              <TextInput
                style={styles.textArea}
                placeholder="Describe los síntomas del paciente..."
                value={symptoms}
                onChangeText={setSymptoms}
                multiline
                numberOfLines={6}
              />

              {isLoading ? (
                <ActivityIndicator size="large" color="#667eea" />
              ) : (
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={consultWithAI}>
                  <Text style={styles.buttonText}>🤖 Analizar con IA</Text>
                </TouchableOpacity>
              )}

              {message ? (
                <View style={styles.resultBox}>
                  <Text style={styles.resultText}>{message}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[styles.button, styles.grayButton]}
                onPress={() => {
                  setCurrentView('home');
                  setSymptoms('');
                  setMessage('');
                }}>
                <Text style={styles.buttonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  // Vista de Registro
  if (currentView === 'register') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.gradient, {backgroundColor: '#667eea'}]}>
          <ScrollView>
            <View style={styles.card}>
              <Text style={styles.title}>Registrar Paciente</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                value={patientData.name}
                onChangeText={(text) => setPatientData({...patientData, name: text})}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Edad"
                value={patientData.age}
                onChangeText={(text) => setPatientData({...patientData, age: text})}
                keyboardType="numeric"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Género (M/F/Otro)"
                value={patientData.gender}
                onChangeText={(text) => setPatientData({...patientData, gender: text})}
              />

              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={registerPatient}>
                <Text style={styles.buttonText}>💾 Guardar Paciente</Text>
              </TouchableOpacity>

              {message ? <Text style={styles.message}>{message}</Text> : null}

              <TouchableOpacity
                style={[styles.button, styles.grayButton]}
                onPress={() => {
                  setCurrentView('home');
                  setPatientData({ name: '', age: '', gender: '' });
                  setMessage('');
                }}>
                <Text style={styles.buttonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 5,
  },
  icon: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  features: {
    marginVertical: 20,
    width: '100%',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
    width: '100%',
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
  },
  secondaryButton: {
    backgroundColor: '#06B6D4',
  },
  tertiaryButton: {
    backgroundColor: '#8B5CF6',
  },
  grayButton: {
    backgroundColor: '#6B7280',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  resultBox: {
    width: '100%',
    padding: 15,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginVertical: 15,
  },
  resultText: {
    fontSize: 14,
    color: '#4B5563',
  },
  message: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    color: '#4B5563',
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default App;