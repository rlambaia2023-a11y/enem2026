import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Importar telas
import HomeScreen from '../screens/HomeScreen';
import ProvasScreen from '../screens/ProvasScreen';
import RedacoesScreen from '../screens/RedacoesScreen';
import NovaRedacaoScreen from '../screens/NovaRedacaoScreen';
import DetalhesRedacaoScreen from '../screens/DetalhesRedacaoScreen';
import MateriasScreen from '../screens/MateriasScreen';
import DetalhesProvaScreen from '../screens/DetalhesProvaScreen';
import EstatisticasScreen from '../screens/EstatisticasScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack de Redações
function RedacoesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#007AFF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="ListaRedacoes" 
        component={RedacoesScreen}
        options={{ title: 'Minhas Redações' }}
      />
      <Stack.Screen 
        name="NovaRedacao" 
        component={NovaRedacaoScreen}
        options={{ title: 'Nova Redação' }}
      />
      <Stack.Screen 
        name="DetalhesRedacao" 
        component={DetalhesRedacaoScreen}
        options={{ title: 'Detalhes da Redação' }}
      />
    </Stack.Navigator>
  );
}

// Stack de Provas
function ProvasStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#007AFF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="ListaProvas" 
        component={ProvasScreen}
        options={{ title: 'Provas do ENEM' }}
      />
      <Stack.Screen 
        name="DetalhesProva" 
        component={DetalhesProvaScreen}
        options={{ title: 'Detalhes da Prova' }}
      />
    </Stack.Navigator>
  );
}

// Navegador principal com tabs
export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Provas') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Redações') {
            iconName = focused ? 'create' : 'create-outline';
          } else if (route.name === 'Matérias') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Estatísticas') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Provas" component={ProvasStack} options={{ title: 'Provas' }} />
      <Tab.Screen name="Redações" component={RedacoesStack} options={{ title: 'Redações' }} />
      <Tab.Screen name="Matérias" component={MateriasScreen} options={{ title: 'Matérias' }} />
      <Tab.Screen name="Estatísticas" component={EstatisticasScreen} options={{ title: 'Estatísticas' }} />
    </Tab.Navigator>
  );
}
