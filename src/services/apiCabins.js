import supabase, { supabaseUrl } from './supabase';

export async function getCabins() {
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error(error);
    throw new Error('An error occurred while fetching cabins');
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  // console.log(hasImagePath);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    '/',
    ''
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // https://sounudvswkuurgeppmqo.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg

  // 1. Create / Edit the cabin
  let query = supabase.from('cabins');

  // A) CREATE
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]); // in CreateCabinForm.jsx register('name') is the same as newCabin.name thats why we can pass newCabin directly

  // B) EDIT
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq('id', id);

  const { data, error } = await query
    .select() // we want to get the data of the cabin that was created
    .single(); // we want to get the single cabin that was created

  if (error) {
    console.error(error);
    throw new Error('An error occurred while creating the cabin');
  }

  // 2. Upload the image
  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, newCabin.image);

  // 3. Delete the cabin if the image upload fails
  if (storageError) {
    await supabase.from('cabins').delete().eq('id', data.id);

    console.error(storageError);
    throw new Error(
      'An error occurred while uploading the image and the cabin was not created'
    );
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from('cabins').delete().eq('id', id);

  if (error) {
    console.error(error);
    throw new Error('An error occurred while deleting the cabin');
  }

  return data;
}
