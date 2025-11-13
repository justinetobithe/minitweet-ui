import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../hooks/useAuth';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const login = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (values: LoginForm) => login.mutate(values);

    const isLoading = login.isPending || isSubmitting;

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-md text-center">
                <h1 className="font-semibold text-2xl mb-2">Welcome to MiniTweet</h1>
                <p className="text-sm text-neutral-500 mb-8">
                    Connect with friends in 280 characters or less
                </p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 text-left text-sm"
                >
                    <div>
                        <input
                            {...register('email')}
                            placeholder="Email"
                            className="w-full rounded-full bg-grayLight px-4 py-3 text-sm outline-none"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            {...register('password')}
                            type="password"
                            placeholder="Password"
                            className="w-full rounded-full bg-grayLight px-4 py-3 text-sm outline-none"
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-full bg-black text-white text-sm py-3 mt-4 disabled:opacity-60"
                    >
                        {isLoading ? 'Logging in...' : 'Log in'}
                    </button>

                    <Link
                        to="/register"
                        className="block w-full rounded-full border border-neutral-300 text-sm py-3 text-center mt-3"
                    >
                        Create Account
                    </Link>
                </form>
            </div>
        </div>
    );
}
