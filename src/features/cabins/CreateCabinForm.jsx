import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import FormRow from '../../ui/FormRow';

import { useForm } from 'react-hook-form';
import { createEditCabin } from '../../services/apiCabins';

function CreateCabinForm({ cabinToEdit = {} }) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { errors } = formState;

  const queryClient = useQueryClient();

  const { mutate: createCabin, status: createStatus } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: () => {
      toast.success('New cabin added successfully');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
      reset();
    },
    onError: err => {
      toast.error(err.message);
    },
  });

  const { mutate: editCabin, status: editStatus } = useMutation({
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id), // mutationFn sadece bir adet arguman alabilir. Bu yuzden, createEditCabin fonksiyonuna bir obje gonderilir.
    onSuccess: () => {
      toast.success('New cabin edited successfully');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
      reset(); //! BUG: Aslinda reset() calisiyor ancak edit submit edildikten sonra form edit edilmeden onceki default verilere donuyor.
    },
    onError: err => {
      toast.error(err.message);
    },
  });

  const isWorking = createStatus === 'pending' || editStatus === 'pending';

  function onSubmit(data) {
    const image = typeof data.image === 'string' ? data.image : data.image[0];

    if (isEditSession)
      editCabin({
        newCabinData: { ...data, image },
        id: editId,
      });
    // yukarida belirttigimiz gibi, mutationFn sadece bir adet arguman alabilir. Bu yuzden, createEditCabin fonksiyonuna bir obje gonderilir.
    else createCabin({ ...data, image });
  }

  function onError(errors) {
    console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register('name', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register('maxCapacity', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity should be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular Price" error={errors?.name?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register('regularPrice', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity should be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          defaultValue={0}
          {...register('discount', {
            required: 'This field is required',
            validate: value =>
              value <= getValues().regularPrice ||
              'Discount should be less than regular price',
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          type="number"
          id="description"
          disabled={isWorking}
          defaultValue=""
          {...register('description', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label="Cabin photo" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          // type="file" // this is not needed because we are using FileInput component
          {...register('image', {
            required: isEditSession ? false : 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? 'Edit cabin' : 'Create new cabin'}
        </Button>
      </FormRow>
    </Form>
  );
}

CreateCabinForm.propTypes = {
  cabinToEdit: PropTypes.object,
};

export default CreateCabinForm;
