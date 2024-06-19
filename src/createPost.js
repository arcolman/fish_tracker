import { useDisclosure } from '@mantine/hooks';
import { Drawer, Group, Button, Input } from '@mantine/core';
import { pb } from './pocketbase';
import { Auth } from './Auth';
import React from 'react';
import { useState } from 'react';
// import { DateInput } from '@mantine/dates';
import './App.css';
import { DateInput, DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form'

export default function CreatePost() {
    const [opened, { open, close }] = useDisclosure(false)
    const [title, setTitle] = useState('')
    const [species, setSpecies] = useState("")
    const [length, setLength] = useState(0)
    const [weight, setWeight] = useState(0)
    const [date, setDate] = useState('')
    const [description, setDescription] = useState("")
    const [location, setLocation] = useState("")
    const [image, setImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const { reset } = useForm()


    function setTitleValue(e) {
        setTitle(e.target.value);
    }

    function setSpeciesValue(e) {
        setSpecies(e.target.value)
    }

    function setLengthValue(e) {
        setLength(e.target.value)
    }

    function setWeightValue(e) {
        setWeight(e.target.value);
    }

    function setDateValue(date) {
        setDate(date);
    }

    function setDescriptionValue(e) {
        setDescription(e.target.value)
    }

    function setLocationValue(e) {
        setLocation(e.target.value)
    }

    function handleImageChange(e) {
        const selectedImage = e.target.files[0];
      
        // Check if the selected file has an accepted MIME type
        if (selectedImage.type === 'image/png' || selectedImage.type === 'image/jpeg') {
          setImage(selectedImage);
        } else {
          // Display an error message or handle the invalid file type as needed
          console.error('Invalid file type. Please select a PNG or JPEG image.');
        }
      }

    async function submit(data) {
        createPost()
        reset()
    }

    async function createPost() {
        setIsLoading(true);
        
        const formData = new FormData();
        formData.append('author', pb.authStore.model.id);
        formData.append('title', title);
        formData.append('species', species);
        formData.append('length', length);
        formData.append('weight', weight);
        formData.append('date', date);
        formData.append('description', description);
        formData.append('location', location);
    
        if (image) {
          formData.append('image', image);
        }
    
        try {
          const record = await pb.collection('posts').create(formData);
          setIsLoading(false);
        } catch (error) {
          console.log('Error', error);
          setIsLoading(false);
        }
      }

    return (
        <>
            <Button onClick={open} className='createButton' color="violet">Open Drawer</Button>
            <Drawer opened={opened} onClose={close} position="bottom" overlayProps={{ opacity: 0.5, blur: 2 }} size="sm" withCloseButton={false} >
                <h2>Add a Catch</h2>
                <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
                    <Group position="center" spacing="lg" grow >
                        <Input.Wrapper label="Species" >
                            <Input type="text" id="species" name="species" value={species} onChange={setSpeciesValue} />
                        </Input.Wrapper>
                        <Input.Wrapper label="Length" >
                            <Input type="number" id="length" name="length" value={length} onChange={setLengthValue} />
                        </Input.Wrapper>
                        <Input.Wrapper label="Weight" >
                            <Input type="number" id="weight" name="weight" value={weight} onChange={setWeightValue} />
                        </Input.Wrapper>
                        <Input.Wrapper label="Date" >
                            <DateInput allowDeselect value={date} onChange={setDateValue} />
                        </Input.Wrapper>
                    </Group>
                    <Group position="center" spacing="lg" grow>
                        <Input.Wrapper label="Title" >
                            <Input type="text" id="title" name="title" value={title} onChange={setTitleValue} styles={{flex: "2"}} />
                        </Input.Wrapper>
                        <Input.Wrapper label="Description" >
                            <Input type="text" id="description" name="description" value={description} onChange={setDescriptionValue} />
                        </Input.Wrapper>
                        <Input.Wrapper label="Location" >
                            <Input type="text" id="location" name="location" value={location} onChange={setLocationValue} />
                        </Input.Wrapper>
                        <Input type='file' name='image' accept='image/png, image/jpg' onChange={handleImageChange} />
                    </Group>
                    <Button type="submit" color="violet" className='addCatchButton'>Create</Button>
                </form>
            </Drawer>
        </>
    )
}