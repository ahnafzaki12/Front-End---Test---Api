import { useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuthContext } from '../context/AuthContext'

export default function Profile() {
    const { user, updateProfile } = useAuthContext()
    const [fullName, setFullName] = useState(user?.fullName || '')
    const [saved, setSaved] = useState(false)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        updateProfile(fullName)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950 transition-colors py-12 px-6">
                <div className="max-w-xl mx-auto">

                    <div className="text-left mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Pengaturan Profil
                        </h1>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                                        Nama Lengkap
                                    </label>
                                    <div className="relative group">
                                        <input
                                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-white transition-all text-base"
                                            placeholder="Contoh: John Doe"
                                            value={fullName}
                                            onChange={e => setFullName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
                                        <span>Simpan Perubahan</span>
                                    </button>
                                </div>

                                {saved && (
                                    <div className="mt-4 flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
                                        <div className="bg-green-500 rounded-full p-1">
                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                                            Profile Anda berhasil diperbarui!
                                        </p>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
