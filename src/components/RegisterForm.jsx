import { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useCreateUserMutation } from 'redux/authApi';

import {
  Form,
  Label,
  Input,
  Button,
  ShowPasswordIcon,
  SecureButton,
  HidePasswordIcon,
} from './StyledComponents';
import { ButtonAddLoader } from './Loaders';
import { Context } from './Layout';
import { darkTheme, lightTheme } from 'themes';
import { useSelector } from 'react-redux';
import { getTheme } from 'redux/selectors';

export const RegisterForm = () => {
  const { handleRedirect } = useContext(Context);
  const theme = useSelector(getTheme);

  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const [createNewUser] = useCreateUserMutation();

  const handleSubmit = async e => {
    e.preventDefault();
    setisLoading(true);
    try {
      const response = await createNewUser({ name, email, password }).unwrap();
      toast.success(`"${response.user.name}" registered successfully`);
      setName('');
      setEmail('');
      setPassword('');
      handleRedirect('/login');
    } catch (error) {
      toast.error(`Wasn't registered`);
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
        htmlFor={'name'}
        style={{
          color: isNameFocused
            ? theme === 'light'
              ? lightTheme.hoverTextColor
              : darkTheme.hoverTextColor
            : theme === 'dark'
            ? darkTheme.primaryTextColor
            : lightTheme.primaryTextColor,
        }}
      >
        Name
      </Label>
      <Input
        style={{ marginBottom: '20px' }}
        type="text"
        name="name"
        value={name}
        onChange={e => setName(e.target.value)}
        onFocus={() => setIsNameFocused(true)}
        onBlur={() => setIsNameFocused(false)}
        id={'name'}
        title="Min 6, max 30 latin letters"
        pattern="^[a-zA-Z\s_-']{6,30}$"
        required
        autoComplete="off"
      />
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
          style={{ marginBottom: '20px', paddingRight: '50px', width: '170px' }}
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
        disabled={isLoading || !name || !email || !password}
      >
        {!isLoading ? 'Sign Up' : <ButtonAddLoader />}
      </Button>
    </Form>
  );
};
