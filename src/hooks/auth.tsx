import React, {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect
} from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextData = {
    signIn: (email: string, password: string) => Promise<void>;
    singOut: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    isLogging: boolean;
    user: User | null;
}

type AuthProviderProps = {
    children: ReactNode;
}

type User = {
    id: string;
    name: string;
    isAdmin: boolean;
}

const USER_COLLECTION = '@gopizzza:users';

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
    const [isLogging, setIsLogging] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    async function signIn(email: string, password: string) {
        if (!email || !password) {
            return Alert.alert('Login', 'Informe o e-mail e a senha')
        }

        setIsLogging(true);

        auth()
            .signInWithEmailAndPassword(email, password)
            .then(account => {
                firestore()
                    .collection('users')
                    .doc(account.user.uid)
                    .get()
                    .then(async (profile) => {
                        const { name, isAdmin } = profile.data() as User;

                        if (profile.exists) {
                            const userData = {
                                id: account.user.uid,
                                name,
                                isAdmin
                            }
                            await AsyncStorage.setItem(USER_COLLECTION, JSON.stringify(userData))
                            setUser(userData);
                        }
                    })
                    .catch(() => {
                        Alert.alert('Login', 'It was not possible to return any data');
                    })
            })
            .catch(error => {
                const { code } = error;

                if (code === 'auth/user-not-found' || code === 'auth/wrong-password') {
                    return Alert.alert('Login', 'E-mail e/ou senha inválidos');
                } else {
                    return Alert.alert('Login', 'Não foi possível realizar o login');
                }
            })
            .finally(() => setIsLogging(false));

    }

    async function forgotPassword(email: string) {
        if (!email) {
            return Alert.alert('Redefine Password', "Fill in the email");
        }

        auth()
        .sendPasswordResetEmail(email)
        .then(() => Alert.alert('Redefine Password', "We sent a link to your email, please check it out"))
        .catch(() => Alert.alert('Redefine Password', "Something went wrong sending email"))
    }

    async function loadUserStorageData() {
        setIsLogging(true);

        const storedUser = await AsyncStorage.getItem(USER_COLLECTION);

        if (storedUser) {
            const userData = JSON.parse(storedUser) as User;
            console.log(userData);
            setUser(userData);
        }

        setIsLogging(false);
    }

    async function singOut() {
        await auth().signOut();
        await AsyncStorage.removeItem(USER_COLLECTION);
        setUser(null);
    }

    useEffect(() => {
        loadUserStorageData();
    }, [])

    return (
        <AuthContext.Provider value={{
            signIn,
            isLogging,
            user,
            singOut,
            forgotPassword
        }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth };