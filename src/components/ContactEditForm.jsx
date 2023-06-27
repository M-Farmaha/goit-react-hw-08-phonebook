import { useContext, useEffect, useState } from 'react';
import { Form, Label, Input, Button } from './styled';
import { useEditContactMutation } from 'redux/contactsApi';
import { toast } from 'react-hot-toast';
import { ButtonAddLoader } from './Loaders';
import { getToken } from 'redux/selectors';
import { useSelector } from 'react-redux';
import { Context } from './Layout';

export const ContactEditForm = ({ userInModal }) => {
  const token = useSelector(getToken);
  const { toggleModal } = useContext(Context);

  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isNumberFocused, setIsNumberFocused] = useState(false);

  const [name, setName] = useState(userInModal.name);
  const [number, setNumber] = useState(userInModal.number);

  const [editContact, { isLoading, isSuccess }] = useEditContactMutation();

  const disableEditButton =
    isLoading ||
    !name ||
    !number ||
    (name.trim() === userInModal.name && number.trim() === userInModal.number);

  useEffect(() => {
    if (isSuccess) toggleModal();
  }, [isSuccess, toggleModal]);

  const handleSubmit = e => {
    e.preventDefault();
    toast.promise(
      editContact({ id: userInModal.id, body: { name, number }, token }),
      {
        loading: `Editing...`,
        success: `Contact edited!`,
        error: `Wasn't edited`,
      }
    );
  };

  return (
    <>
      <Form
        style={{ marginTop: '30px' }}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <Label
          htmlFor={'editname'}
          style={{ color: isNameFocused && 'rgb(87, 88, 134)' }}
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
          id={'editname'}
          title="min 3, max 40 symbols"
          pattern="^.{3,40}$"
          required
        />
        <Label
          htmlFor={'editnumber'}
          style={{ color: isNumberFocused && 'rgb(87, 88, 134)' }}
        >
          Number
        </Label>
        <Input
          style={{ marginBottom: '20px' }}
          type="tel"
          name="number"
          value={number}
          onChange={e => setNumber(e.target.value)}
          onFocus={() => setIsNumberFocused(true)}
          onBlur={() => setIsNumberFocused(false)}
          id={'editnumber'}
          title="Min 6, max 30 figures, spaces, '-' and '_'"
          pattern="^[0-9\s_\-]{6,30}$"
          required
        />
        <Button
          style={{ marginBottom: '40px' }}
          type="submit"
          disabled={disableEditButton}
        >
          {!isLoading ? 'Edit contact' : <ButtonAddLoader />}
        </Button>
      </Form>
    </>
  );
};
