import supabase from './supabase';

export async function getCabins() {
  const { data, error } = await supabase.from('cabins').select('*');

  if (error) {
    console.error(error);
    throw new Error('An error occurred while fetching cabins');
  }

  return data;
}

export async function createCabin(newCabin) {
  const { data, error } = await supabase
    .from('cabins')
    .insert([newCabin]) // register('name') is the same as newCabin.name thats why we can pass newCabin directly
    .select();

  if (error) {
    console.error(error);
    throw new Error('An error occurred while creating the cabin');
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
