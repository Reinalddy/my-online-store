import { useRouter } from 'next/router';
import styles from './Login.module.scss'
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';

const LoginView = () => {
   const { push, query } = useRouter();
   const [isloading, setIsLoading] = useState(false);
   const [error, setError] = useState('');

   const callbackUrl = query.callbackUrl || '/';
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    const form = event.target as HTMLFormElement;

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: form.email.value,
        password: form.password.value,
        callbackUrl: Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl
      });

      if(!res?.error) {
        setIsLoading(false);
        form.reset();
        push(callbackUrl as string);
      } else {
        setIsLoading(false);
        setError('Invalid credentials');
      }
      
    } catch (error) {
      setIsLoading(false);
      setError(error as string);
      
    }

  }

  return (
    <div className={styles.login}>
      <h1 className={styles.login__title}>Login</h1>
      {error && <p className={styles.login__error}>{error}</p>}
      <div className={styles.login__form}>
        <form onSubmit={handleSubmit}>
          <div className={styles.login__form__item}>
            <label htmlFor="email">Email</label>
            <input type="email" name='email' id='email' className={styles.login__form__item__input}/>
          </div>
          <div className={styles.login__form__item}>
            <label htmlFor="password">Password</label>
            <input type="password" name='password' id='password' className={styles.login__form__item__input}/>
          </div>
          <button className={styles.login__form__button} type='submit'>{isloading ? 'Loading...' : 'login'}</button>
        </form>
      </div>
      <p className={styles.login__link}>Don{"'"}t have an account ? Sign up <Link href={"/auth/register"}>Here</Link></p>
    </div>
  );
};

export default LoginView;