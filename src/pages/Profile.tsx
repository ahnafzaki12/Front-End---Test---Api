import { useState, useEffect } from 'react'
import MainLayout from '../components/MainLayout'
import { useAuthContext } from '../context/AuthContext'

export default function ProfilePage() {
    const { user, updateProfile } = useAuthContext()

    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
            })
        }
    }, [user])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            await updateProfile(formData)
            setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' })
        } catch (err: any) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Gagal memperbarui profil'
            })
        } finally {
            setLoading(false)
            setTimeout(() => setMessage(null), 4000)
        }
    }

    const initial = formData.name
        ? formData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2)
        : '??'

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto py-10 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 text-center shadow-sm">
                            <div className="relative inline-block group">
                                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-200 dark:shadow-none mx-auto mb-4">
                                    {initial}
                                </div>
                                <div className="absolute inset-0 rounded-full border-2 border-blue-600 scale-110 opacity-20 group-hover:scale-125 transition-transform duration-500"></div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">{formData.name || 'Your Name'}</h2>
                            <p className="text-gray-400 text-sm mt-1">@{formData.username}</p>
                            
                            <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-700 space-y-4 text-left">
                                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    <span className="text-xs truncate">{formData.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    <span className="text-xs">{formData.phone || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 md:p-10 shadow-sm">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Informasi Umum</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 dark:text-white transition-all"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Username</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 dark:text-white transition-all"
                                                value={formData.username}
                                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-50 dark:border-gray-700">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Kontak & Keamanan</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Alamat Email</label>
                                            <input
                                                type="email"
                                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 dark:text-white transition-all"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Nomor Telepon</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 dark:text-white transition-all"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="order-2 md:order-1">
                                        {message && (
                                            <div className={`flex items-center gap-2 transition-all duration-300 ${message.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                                <span className="text-sm font-medium">{message.text}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full md:w-auto order-1 md:order-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : 'Simpan Perubahan'}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}