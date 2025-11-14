import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "../hooks/useAuth";

const registerSchema = z
    .object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(8, "Password must be at least 8 characters long"),
        password_confirmation: z
            .string()
            .min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
        path: ["password_confirmation"],
    });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const registerMutation = useRegister();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (values: RegisterForm) => {
        registerMutation.mutate({
            name: values.name,
            email: values.email,
            password: values.password,
            password_confirmation: values.password_confirmation,
        });
    };

    const isLoading = registerMutation.isPending || isSubmitting;

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-md text-center">
                <h1 className="mb-2 text-2xl font-semibold text-neutral-900">
                    Sign up with Email
                </h1>
                <p className="mb-6 text-sm text-neutral-500">
                    Join MiniTweet and start sharing your thoughts.
                </p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 text-left text-sm"
                >
                    <div>
                        <input
                            {...register("name")}
                            placeholder="Full name"
                            className="w-full rounded-full bg-grayLight px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            {...register("email")}
                            placeholder="Email Address"
                            className="w-full rounded-full bg-grayLight px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            {...register("password")}
                            type="password"
                            placeholder="Password"
                            className="w-full rounded-full bg-grayLight px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400"
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            {...register("password_confirmation")}
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full rounded-full bg-grayLight px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400"
                        />
                        {errors.password_confirmation && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.password_confirmation.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-5 w-full rounded-full bg-neutral-900 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>

                    <p className="mt-3 text-xs text-neutral-500 text-center">
                        By signing up, you agree to our Terms &amp; Conditions.
                    </p>

                    <p className="mt-4 text-sm text-neutral-600 text-center">
                        Have an account already?{" "}
                        <Link to="/login" className="font-medium text-neutral-900 underline">
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
