'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import Link from 'next/link';
import GoogleSignInButton from '../GoogleSignInButton';
import {useDispatch} from 'react-redux';
import { useRouter } from 'next/navigation';
import { signUp } from '@/redux/actions/auth';
import { useState } from 'react';
import { ClipLoader } from "react-spinners";


const FormSchema = z
  .object({
    name: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
      retypePassword:z
      .string()
      .min(1, 'confirmPassword is required')
      .min(8, 'confirmPassword must have than 8 characters'),
  })

const SignUpForm = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      retypePassword:'',
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true); 
    try {
      await dispatch<any>(signUp(values, router));
      form.reset();
    } catch (error) {
     console.log(error)
    } finally {
      setIsLoading(false); 
    }
  };

  return (

    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="mail@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name='retypePassword'
            render={({ field }:any) => (
              <FormItem>
                <FormLabel>{"confirm password"}</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter confirm password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      </div>
      <Button
        className="w-full mt-6 bg-blue-600 hover:bg-blue-500"
        type="submit"
      >
       {isLoading ? <ClipLoader color="white" size={30} /> : 'Sign up'}
      </Button>
    </form>
    <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
      or
    </div>
    <GoogleSignInButton>Sign up with Google</GoogleSignInButton>
    <p className="text-center text-sm text-gray-600 mt-2">
      If you have an account, please&nbsp;
      <Link className="text-blue-500 hover:underline" href={`/sign-in`}>
        Sign in
      </Link>
    </p>
  </Form>
  );
};

export default SignUpForm;