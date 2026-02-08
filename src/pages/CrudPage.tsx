import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { getItems, saveItems } from '../utils/itemStorage'
import { useSearchParams } from 'react-router-dom'
import type { Item } from '../types/item'

export default function CrudPage() {
    const [items, setItems] = useState<Item[]>([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [alert, setAlert] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [params, setParams] = useSearchParams()
    const search = params.get('search') || ''
    const page = Number(params.get('page')) || 1
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    const ITEMS_PER_PAGE = 5

    useEffect(() => {
        setItems(getItems())
    }, [])

    const showAlert = (msg: string, type: 'success' | 'error' = 'success') => {
        setAlert({ msg, type })
        setTimeout(() => setAlert(null), 3000)
    }

    function updateParams(newSearch: string, newPage: number) {
        setParams({
            search: newSearch,
            page: String(newPage),
        })
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            if (editingId) {
                const updated = items.map(item =>
                    item.id === editingId ? { ...item, name, email } : item
                )
                setItems(updated)
                saveItems(updated)
                showAlert('Data berhasil diperbarui!')
            } else {
                const newItem: Item = { id: Date.now(), name, email }
                const updated = [...items, newItem]
                setItems(updated)
                saveItems(updated)
                showAlert('Data berhasil ditambahkan!')
            }
            setName(''); setEmail(''); setEditingId(null)
        } catch (err) {
            showAlert('Terjadi kesalahan sistem!', 'error')
        }
    }

    function handleEdit(item: Item) {
        setEditingId(item.id)
        setName(item.name)
        setEmail(item.email)
    }

    function confirmDelete(id: number) {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    }

    function executeDelete() {
        if (itemToDelete !== null) {
            const updated = items.filter(item => item.id !== itemToDelete);
            setItems(updated);
            saveItems(updated);

            setIsDeleteModalOpen(false);
            setItemToDelete(null);
            showAlert('Data telah berhasil dihapus!', 'success');
        }
    }

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase())
    )

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)

    const paginatedItems = filteredItems.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            <Navbar />
            <div className="p-8 max-w-5xl mx-auto md:p-6 md:ml-14 md:mr-16 md:max-w-none md:mx-0">
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Management Data
                        </h1>
                    </div>

                    <div className="relative w-full md:w-80">
                        <input
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 pl-10 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                            placeholder="Cari nama atau email..."
                            value={search}
                            onChange={e => updateParams(e.target.value, 1)}
                        />
                    </div>
                </div>

                {/* FORM */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        {alert && (
                            <div className={`mb-6 flex items-center gap-3 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${alert.type === 'success'
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800'
                                : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'
                                }`}>
                                <div className={`${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'} rounded-full p-1`}>
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {alert.type === 'success' ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                        )}
                                    </svg>
                                </div>
                                <p className={`text-sm font-medium ${alert.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                    {alert.msg}
                                </p>
                            </div>
                        )}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
                            <h2 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
                                {editingId ? 'Edit Data' : 'Tambah Data'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 block">Nama Lengkap</label>
                                    <input
                                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 dark:text-white transition-colors"
                                        placeholder="Masukkan nama"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 block">Alamat Email</label>
                                    <input
                                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 dark:text-white transition-colors"
                                        placeholder="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all cursor-pointer">
                                    {editingId ? 'Simpan Perubahan' : 'Tambah Data Baru'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => { setName(''); setEmail(''); setEditingId(null); }}
                                        className="w-full bg-transparent text-gray-500 text-sm hover:underline cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* TABEL */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {paginatedItems.map(item => (
                                        <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-gray-900 dark:text-gray-100">{item.name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                                {item.email}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 font-semibold text-sm transition-colors cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(item.id)}
                                                    className="text-red-500 hover:text-red-700 font-semibold text-sm transition-colors cursor-pointer"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="text-center py-20 text-gray-500 dark:text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <p>Belum ada data yang ditemukan</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-center items-center gap-3 mt-8">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                                <button
                                    key={num}
                                    onClick={() => updateParams(search, num)}
                                    className={`min-w-10 h-10 rounded-xl font-bold transition-all cursor-pointer ${page === num
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700 hover:border-blue-500'
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* pop confirmation */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsDeleteModalOpen(false)}
                    ></div>
                    <div className="relative bg-white dark:bg-gray-900 w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Hapus Data?</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus data ini?</p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={executeDelete}
                                    className="flex-1 px-4 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all cursor-pointer"
                                >
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
