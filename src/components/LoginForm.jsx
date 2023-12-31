import { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useDispatch, useSelector } from 'react-redux';
import { useLoginUserMutation } from 'redux/authApi';
import { setToken } from 'redux/slice';

import { ButtonAddLoader } from './Loaders';
import {
  Form,
  Label,
  Input,
  Button,
  SecureButton,
  HidePasswordIcon,
  ShowPasswordIcon,
} from './StyledComponents';
import { Context } from './Layout';
import { getTheme } from 'redux/selectors';
import { darkTheme, lightTheme } from 'themes';

export const LoginForm = () => {
  const { handleRedirect } = useContext(Context);
  const theme = useSelector(getTheme);

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const [loginUser] = useLoginUserMutation();

  const dispatch = useDispatch();

  const handleSubmit = async e => {
    e.preventDefault();
    setisLoading(true);
    try {
      const response = await loginUser({ email, password }).unwrap();
      toast.success(`Welcome, "${response.user.name}"!`);
      setTimeout(() => {
        dispatch(setToken(response.token));
      }, 300);
      setEmail('');
      setPassword('');
      handleRedirect('/');
    } catch (error) {
      toast.error(`Access denied`);
    }
    setisLoading(false);
  };

  return (
    <Form
      style={{ marginTop: '60px' }}
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <Label
        htmlFor={'email'}
        style={{
          color: isEmailFocused
            ? theme === 'light'
              ? lightTheme.hoverTextColor
              : darkTheme.hoverTextColor
            : theme === 'dark'
            ? darkTheme.primaryTextColor
            : lightTheme.primaryTextColor,
        }}
      >
        E-mail Address
      </Label>
      <Input
        style={{ marginBottom: '20px' }}
        type="email"
        name="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onFocus={() => setIsEmailFocused(true)}
        onBlur={() => setIsEmailFocused(false)}
        id={'email'}
        required
        autoComplete="off"
      />
      <Label
        htmlFor={'password'}
        style={{
          color: isPasswordFocused
            ? theme === 'light'
              ? lightTheme.hoverTextColor
              : darkTheme.hoverTextColor
            : theme === 'dark'
            ? darkTheme.primaryTextColor
            : lightTheme.primaryTextColor,
        }}
      >
        Password
      </Label>

      <div style={{ position: 'relative' }}>
        <Input
          style={{
            marginBottom: '20px',
            paddingRight: '50px',
            width: '170px',
          }}
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
          id={'password'}
          title="Min 7, max 20 latin letters and figures"
          pattern="^[a-zA-Z0-9]{7,20}$"
          required
          autoComplete="off"
        />
        <SecureButton
          style={{ position: 'absolute', top: 0, right: 0 }}
          type="button"
          onClick={() => setShowPassword(prevState => !prevState)}
        >
          {showPassword ? <HidePasswordIcon /> : <ShowPasswordIcon />}
        </SecureButton>
      </div>

      <Button
        style={{ marginBottom: '20px' }}
        type="submit"
        disabled={isLoading || !email || !password}
      >
        {!isLoading ? 'Sign In' : <ButtonAddLoader />}
      </Button>
    </Form>
  );
};
