import React from 'react'

const useAuth = () => {
    const role = localStorage.getItem('role') || 'Guest';

    return { role };
}

export default useAuth