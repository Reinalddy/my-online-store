import { useRouter } from 'next/router';
import styles from './Register.module.scss'
import Link from 'next/link';
import { FormEvent, useState } from 'react';

const RegisterView = () => {
   const { push } = useRouter();
   const [isloading, setIsLoading] = useState(false);
   const [error, setError] = useState('');
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    const form = event.target as HTMLFormElement;

    const data = {
      email: form.email.value,
      fullname: form.fullName.value,
      phone: form.phone.value,
      password: form.password.value
    }
    // console.log(data);
    // HIT API
    const result = await fetch('/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if(result.status === 200) {
      form.reset();
      setIsLoading(false);
      // redirect to login page
      push('/auth/login');
    } else {
      setIsLoading(false);
      setError("Email Sudah terdaftar");
      console.log(result);
    }

  }

  return (
    <div className={styles.register}>
      <h1 className={styles.register__title}>Register</h1>
      {error && <p className={styles.register__error}>{error}</p>}
      <div className={styles.register__form}>
        <form onSubmit={handleSubmit}>
          <div className={styles.register__form__item}>
            <label htmlFor="email">Email</label>
            <input type="email" name='email' id='email' className={styles.register__form__item__input}/>
          </div>
          <div className={styles.register__form__item}>
            <label htmlFor="fullname">FullName</label>
            <input type="text" name='fullName' id='fullname' className={styles.register__form__item__input}/>
          </div>
          <div className={styles.register__form__item}>
            <label htmlFor="phone">Phone</label>
            <input type="text" name='phone' id='phone' className={styles.register__form__item__input}/>
          </div>
          <div className={styles.register__form__item}>
            <label htmlFor="password">Password</label>
            <input type="password" name='password' id='password' className={styles.register__form__item__input}/>
          </div>
          <button className={styles.register__form__button} type='submit'>{isloading ? 'Loading...' : 'Register'}</button>
        </form>
      </div>
      <p className={styles.register__link}>Have an account? Sign in <Link href={"/auth/login"}>Here</Link></p>
    </div>
  );
};

export default RegisterView;