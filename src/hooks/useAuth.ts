import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api'; 
import { useAuthStore } from '../store/authStore';
import type { User } from '../types/User';

export const useUserQuery = () => {
    const setUser = useAuthStore((s) => s.setUser);

    return useQuery({
        queryKey: ['user'],
        queryFn: async (): Promise<User | null> => {
            try {
                const { data } = await api.get<User>('/user');
                const user = data ?? null;
                setUser(user);
                return user;
            } catch {
                setUser(null);
                return null;
            }
        },
    });
};

export const useLogin = () => {
    const qc = useQueryClient();
    const setAuth = useAuthStore((s) => s.setAuth);

    return useMutation({
        mutationFn: async (payload: { email: string; password: string }) => {
            const { data } = await api.post('/login', payload);
            return data as { user: User; token: string };
        },
        onSuccess: (res) => {
            setAuth(res.user, res.token);
            qc.invalidateQueries({ queryKey: ['user'] });
        },
    });
};

export const useRegister = () => {
    const qc = useQueryClient();
    const setAuth = useAuthStore((s) => s.setAuth);

    return useMutation({
        mutationFn: async (payload: {
            name: string;
            email: string;
            password: string;
            password_confirmation: string;
        }) => {
            const { data } = await api.post('/register', payload);
            return data as { user: User; token: string };
        },
        onSuccess: (res) => {
            setAuth(res.user, res.token);
            qc.invalidateQueries({ queryKey: ['user'] });
        },
    });
};

export const useLogout = () => {
    const qc = useQueryClient();
    const reset = useAuthStore((s) => s.reset);

    return useMutation({
        mutationFn: async () => {
            const { data } = await api.post('/logout');
            return data;
        },
        onSuccess: () => {
            reset();
            qc.removeQueries({ queryKey: ['user'] });
        },
    });
};
