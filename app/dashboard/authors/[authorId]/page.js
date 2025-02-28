import React from 'react'

const AuthorDashboard = () => {
  return ( 
    <div className='ml-72  mt-20'>
      <h2 className='font-bold text-2xl'>Welcome! Chimdindu, What would you like to create?</h2>
  <div className="py-4  grid grid-cols-3">

   <div className='col-span-2 h-10'>

    <div className='grid grid-cols-2 gap-3 w-[460px]'>
    <div class="flex flex-col items-center justify-center p-7 bg-gray-200 rounded-2xl w-56 h-48 ">
        <img class="w-16 h-16 mb-2" src="/images/ebook.png" alt="Ebook"/>
        <h5 class="mb-1 text-lg font-medium text-gray-900 dark:text-white">E-Books</h5>   
    </div>
    <div class="flex flex-col items-center p-7 bg-gray-200 rounded-2xl w-56 h-48 justify-center">
        <img class="w-16 h-16 mb-2" src="/images/audiobook.png" alt="Ebook"/>
        <h5 class="mb-1 text-lg font-medium text-gray-900 dark:text-white">Audiobooks</h5>   
    </div>
    <div class="flex flex-col items-center p-7 bg-gray-200 rounded-2xl w-56 h-48 justify-center">
        <img class="w-16 h-16 mb-2" src="/images/book-series.png" alt="Ebook"/>
        <h5 class="mb-1 text-lg font-medium text-gray-900 dark:text-white">Book Series</h5>   
    </div>
    </div>
    <h2 className='font-bold text-xl mt-10 mb-4'>Recent Uploads</h2>
    <div className='grid grid-cols-3 mb-10'>
     
      
     

<div class="max-w-sm bg-white border border-[#E50913] rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 w-48 p-2 mb-10">
    <a href="#">
        <img class="rounded-t-lg" src="/images/psychology.png" alt="psychology book" />
    </a>
    <div class="pt-2 ">
        <a href="#">
            <h5 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">The Psychology of m...</h5>
        </a>
        <p class="mb-2 font-normal text-gray-700 dark:text-gray-400">Type: E-Book</p>
        <div className='flex justify-between'><div className='flex items-center'><p className='text-xl font-bold mr-1'>4.2</p><img src='/images/star.png' className='w-5 h-5'/></div><p className='text-xl font-bold'>&#36;35</p></div>
        
    </div>
</div>
<div class="max-w-sm bg-white border border-[#E50913] rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 w-48 p-2 mb-10">
    <a href="#">
        <img class="rounded-t-lg" src="/images/art.png" alt="The Book of Art" />
    </a>
    <div class="pt-2 ">
        <a href="#">
            <h5 class="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">The Book of Art</h5>
        </a>
        <p class="mb-2 font-normal text-gray-700 dark:text-gray-400">Type: Audiobook</p>
        <div className='flex justify-between'><div className='flex items-center'><p className='text-xl font-bold mr-1'>4.2</p><img src='/images/star.png' className='w-5 h-5'/></div><p className='text-xl font-bold'>&#36;35</p></div>
        
    </div>
</div>



    </div>
   </div>

   <div className='flex flex-col items-center justify-between w-[280px] h-[85vh] bg-white p-2 shadow-lg shadow-gray-500/50 -mt-10'>
  <div className='w-full'>
  <div className='flex justify-center mb-3'><img src="/images/notifications.png" alt="notification" className='w-6 h-6 mr-2'/> <p>Notifications</p></div>
  <div className='h-[2px] w-11/12 bg-[#12121299] mx-auto'/>
  </div>
    <div className='text-center'>
      <p className='text-[14px] font-semibold'>You don’t have any recent transaction</p>
      <p className='text-sm text-[#414141]'>Transactions appear here</p>
    </div>
    <div />
   </div>

  </div>
  </div>
  )
}

export default AuthorDashboard