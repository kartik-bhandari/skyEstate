import React from 'react'
import { useState } from 'react'
import {getDownloadURL, getStorage, ref ,uploadBytesResumable} from 'firebase/storage'
import {app} from '../../firebase'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

const createListing = () => {
  const navigate = useNavigate()
  const {currentUser} = useSelector(state => state.user)
  const [files,setFiles] = useState([])
  const [error,setError] = useState(false)
  const [loading,setLoading] = useState(false)
  const [formData,setFormData] = useState({
    imageUrls:[],
    name: '',
    description:'',
    address:'',
    type:'rent',
    bathrooms:1,
    bedrooms:1,
    regularPrice: 50,
    discountedPrice:0,
    offer: false,
    parking: false,
    furnished:false,
  })
  console.log(formData)
  const [imageUploadError , setImageUploadError] = useState(false);
  const [imageUploading , setImageUploading] = useState(false);

  const handleImageSubmit = (e) =>{

    if(files.length > 0 && files.length+ formData.imageUrls.length < 7){
      setImageUploading(true)
      setImageUploadError(false)
      const promises = [];
      for(let i = 0; i< files.length ; i++){
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls)=>{
        setFormData({...formData , imageUrls:formData.imageUrls.concat(urls)});
        setImageUploadError(false);
        setImageUploading(false)
        
      }).catch((err)=>{
        setImageUploadError('image upload failed (2mb max per image)')
        setImageUploading(false)
      });
    }else{
      setImageUploadError('You can only upload 6 images per listing')
      setImageUploading(false)
    }
  }

  const storeImage = async(file)=>{
    return new Promise((resolve,reject)=>{
      const storage = getStorage(app);
      const fileName = new Date().getTime()+ file.name
      const storageRef = ref(storage,fileName);
      const uploadTask = uploadBytesResumable(storageRef , file)
      uploadTask.on(
        "state_changed",
        (snapshot)=>{
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
          console.log(`upload is  ${progress}% done`)
        },
        (error)=>{
          reject(error);
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
            resolve(downloadUrl)
          });
        }
      )
    })
  }

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls:formData.imageUrls.filter((_ , i)=> i !== index),
    })
  }

  const handleChange = (e) =>{
    if(e.target.id === 'sale' || e.target.id === 'rent'){
      setFormData({
        ...formData,
        type: e.target.id
      })
    }

    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer' ){
      setFormData({
        ...formData,
        [e.target.id] : e.target.checked
      })
    }

    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
      setFormData({
        ...formData,
        [e.target.id]:e.target.value
      })
    }
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    setError(false)
    try {
      if(formData.imageUrls.length < 1){
        return setError('You must upload at least one image')
      }

      if(formData.regularPrice < formData.discountedPrice){
        return setError('Discounted price must be lower than regular price')
      }
      console.log(error)
      setLoading(true)
      setError(false)
      const res = await fetch ('/api/listing/create' ,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef:currentUser._id,
      }),
      })
      const data = await res.json()
      setLoading(false)
      if(data.success === false){
        setError(data.message)
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <main className='p-3 max-w-6xl mx-auto'>
      <h1 className='sm:text-2xl text-lg mt-20 font-semibold text-center my-7'>
        Create a listing
      </h1>
      <form onSubmit={handleSubmit} className='flex text-sm sm:text[1rem] flex-col sm:flex-row gap-8'>
        <div className='flex flex-col gap-4 flex-1'>
          <input onChange={handleChange} value={formData.name} className='border p-3 rounded-lg' type="text" placeholder='Name' id='name' maxLength='62' required/>
          <textarea onChange={handleChange} value={formData.description} className='border p-3 rounded-lg' type="text" placeholder='Description' id='description' required/>
          <input onChange={handleChange} value={formData.address} className='border p-3 rounded-lg' type="text" placeholder='Address' id='address'required/>
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input checked={formData.type === 'sale'} onChange={handleChange} className='w-5' type="checkbox" id="sale" />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input checked={formData.type === 'rent'} onChange={handleChange} className='w-5' type="checkbox" id="rent" />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input checked={formData.parking} onChange={handleChange} className='w-5' type="checkbox" id="parking" />
              <span>Parking Spot</span>
            </div>
            <div className='flex gap-2'>
              <input checked={formData.furnished} onChange={handleChange} className='w-5' type="checkbox" id="furnished" />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input checked={formData.offer} onChange={handleChange} className='w-5' type="checkbox" id="offer" />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input value={formData.bedrooms} onChange={handleChange} className='p-3 border border-gray rounded-lg' type="number" id='bedrooms' min='1' max='10' required/>
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input value={formData.bathrooms} onChange={handleChange} className='p-3 border border-gray rounded-lg' type="number" id='bathrooms' min='1' max='10' required/>
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input value={formData.regularPrice} onChange={handleChange} className='p-3 border border-gray rounded-lg' type="number" id='regularPrice' min='50' max='1000000' required/>
              <div>
              <p>Regular price</p>
              <span className='text-xs'>($ /month)</span>
              </div>
            </div>
            {formData.offer &&(
            <div className='flex items-center gap-2'>
              <input value={formData.discountedPrice} onChange={handleChange} className='p-3 border border-gray rounded-lg' type="number" id='discountedPrice' min='0' max='1000000' required/>
              <div>
              <p>Discount price</p>
              <span className='text-xs'>($ /month)</span>
              </div>
            </div>
            )}
          </div>
        </div>

        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>Images:
          <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
          </p>
          <div className='flex gap-4'>
            <input onChange={(e)=>setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id="images" accept='image/*' multiple/>
            <button type='button' onClick={handleImageSubmit} disabled={imageUploading} className='p-3 text-sm sm:text-[1rem text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{imageUploading ? 'Uploading...' : 'Upload'}</button>
          </div>
          <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
          {
            formData.imageUrls.length>0 && formData.imageUrls.map((url,index)=>(
              <div key={url} className='flex justify-between p-3 border items-center'>
              <img src={url} alt="listing image" className='w-24 border-black border-[0.01rem] h-14 object-cover rounded-lg' />
              <button onClick={()=>handleRemoveImage(index)} type='button' className='p-3 text-sm sm:text-[1rem] text-red-700 rounded-lg hover:opacity-75'>Delete</button>
              </div>
            ))
          }
        <button disabled={loading || imageUploading} className='p-3 text-sm sm:text-[1rem bg-slate-700 text-white rounded-lg uppercase hover:opacity-80 disabled:opacity-80'>
          {loading ? 'Creating..' : 'Create Listing'}
        </button>
        {error && <p className='text-red-700 text-sm'> {error} </p> }
        </div>
      </form>
    </main>
  )
}

export default createListing