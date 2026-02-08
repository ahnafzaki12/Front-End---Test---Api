import { useEffect, useState, useCallback } from 'react'
import Navbar from '../components/Navbar'
import { useSearchParams } from 'react-router-dom'
import { getEmployees, deleteEmployee, createEmployee, updateEmployee } from '../services/employeeService'
import { getDivisions } from '../services/divisionService'
import type { Division, Employee } from '../types/item'

export default function CrudPage() {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [divisions, setDivisions] = useState<Division[]>([])

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [position, setPosition] = useState('')
    const [divisionId, setDivisionId] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)

    const [editingId, setEditingId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [alert, setAlert] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

    const [params, setParams] = useSearchParams()
    const search = params.get('search') || ''
    const filterDivision = params.get('division_id') || ''
    const page = params.get('page') || '1'
    const [pagination, setPagination] = useState<any>(null)

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const showAlert = (msg: string, type: 'success' | 'error' = 'success') => {
        setAlert({ msg, type });
        setTimeout(() => setAlert(null), 3000)
    }

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const query = new URLSearchParams({
                name: search,
                division_id: filterDivision,
                page: page
            }).toString()

            const [empRes, divRes] = await Promise.all([
                getEmployees(query),
                getDivisions()
            ])

            setEmployees(empRes.data.employees)
            setPagination(empRes.pagination)
            setDivisions(divRes.data.divisions)
        } catch (err) {
            showAlert('Gagal memuat data', 'error')
        } finally {
            setLoading(false)
        }
    }, [search, filterDivision, page])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData()
        formData.append('name', name)
        formData.append('phone', phone)
        formData.append('division', divisionId)
        formData.append('position', position)
        if (imageFile) formData.append('image', imageFile)

        try {
            if (editingId) {
                formData.append('_method', 'PUT')
                await updateEmployee(editingId, formData)
                showAlert('Data berhasil diperbarui!')
            } else {
                await createEmployee(formData)
                showAlert('Data berhasil ditambahkan!')
            }
            resetForm()
            fetchData()
        } catch (err: any) {
            showAlert(err.message || 'Gagal menyimpan data', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    function resetForm() {
        setName(''); setPhone(''); setPosition(''); setDivisionId('');
        setImageFile(null); setEditingId(null)
    }

    function handleEdit(emp: Employee) {
        setEditingId(emp.id)
        setName(emp.name)
        setPhone(emp.phone)
        setPosition(emp.position)
        setDivisionId(emp.division.id)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function confirmDelete(id: string) {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    }

    async function executeDelete() {
        if (!itemToDelete) return
        try {
            await deleteEmployee(itemToDelete)
            showAlert('Data telah berhasil dihapus!', 'success')
            setIsDeleteModalOpen(false)
            setItemToDelete(null)
            fetchData()
        } catch (err) {
            showAlert('Gagal menghapus data', 'error')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            <Navbar />
            <div className="p-8 max-w-7xl mx-auto md:p-6 md:ml-14 md:mr-16 md:max-w-none md:mx-0">

                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Manajemen Data Karyawan</h1>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <input
                            className="w-full md:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white text-sm"
                            placeholder="Cari nama..."
                            value={search}
                            onChange={e => setParams({ search: e.target.value, division_id: filterDivision, page: '1' })}
                        />
                        <div className="relative">
                            <select
                                className="appearance-none w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 pr-10 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white cursor-pointer text-sm"
                                value={filterDivision}
                                onChange={e => setParams({ search, division_id: e.target.value, page: '1' })}
                            >
                                <option value="">Semua Divisi</option>
                                {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        {alert && (
                            <div className={`mb-6 flex items-center gap-3 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${alert.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'}`}>
                                <p className={`text-sm font-medium ${alert.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>{alert.msg}</p>
                            </div>
                        )}

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
                            <h2 className="text-lg font-bold mb-5 dark:text-white">{editingId ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="text-[11px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1.5 block tracking-wider">Nama Lengkap</label>
                                    <input className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 dark:text-white text-sm" value={name} onChange={e => setName(e.target.value)} required placeholder="Nama anda" />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1.5 block tracking-wider">Nomor Telepon</label>
                                    <input className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 dark:text-white text-sm" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="Nomor telepon" />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1.5 block tracking-wider">Divisi & Jabatan</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="relative">
                                            <select className="appearance-none w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 dark:text-white cursor-pointer text-sm" value={divisionId} onChange={e => setDivisionId(e.target.value)} required>
                                                <option value="">Divisi</option>
                                                {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                        </div>
                                        <input className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 outline-none focus:border-blue-500 dark:text-white text-sm" value={position} onChange={e => setPosition(e.target.value)} required placeholder="Jabatan" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1.5 block tracking-wider">Foto Profil</label>
                                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                                </div>

                                <button disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-xl transition-all cursor-pointer text-sm mt-2">
                                    {isSubmitting ? 'Proses...' : (editingId ? 'Simpan Perubahan' : 'Tambah Karyawan')}
                                </button>
                                {editingId && <button type="button" onClick={resetForm} className="w-full text-gray-500 text-sm hover:underline cursor-pointer">Batal</button>}
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Karyawan</th>
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Divisi & Jabatan</th>
                                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {loading ? (
                                            <tr><td colSpan={3} className="text-center py-10 animate-pulse text-gray-400 text-sm">Memuat data...</td></tr>
                                        ) : (
                                            employees.map(emp => (
                                                <tr key={emp.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-4">
                                                            {emp.image ? (
                                                                <img src={emp.image} alt="" className="w-11 h-11 rounded-full object-cover bg-gray-100 ring-2 ring-white dark:ring-gray-800" />
                                                            ) : (
                                                                <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-base ring-2 ring-white dark:ring-gray-800">
                                                                    {emp.name?.charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="font-bold text-gray-900 dark:text-gray-100 leading-tight text-[14px]">{emp.name}</div>
                                                                <div className="text-[13px] text-gray-400 mt-1">{emp.phone}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 mb-1.5 uppercase tracking-wide">
                                                            {emp.division.name}
                                                        </span>
                                                        <div className="text-[13px] text-gray-500 dark:text-gray-400">{emp.position}</div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right space-x-4">
                                                        <button onClick={() => handleEdit(emp)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 font-bold text-[13px] transition-colors cursor-pointer">Edit</button>
                                                        <button onClick={() => confirmDelete(emp.id)} className="text-red-500 hover:text-red-700 font-bold text-[13px] transition-colors cursor-pointer">Hapus</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
                                {loading ? (
                                    <div className="p-6 text-center animate-pulse text-gray-400">Memuat data...</div>
                                ) : (
                                    employees.map(emp => (
                                        <div key={emp.id} className="p-4 space-y-4">
                                            <div className="flex items-center gap-4">
                                                {emp.image ? (
                                                    <img src={emp.image} alt="" className="w-12 h-12 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                        {emp.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <div className="font-bold text-gray-900 dark:text-gray-100">{emp.name}</div>
                                                    <div className="text-xs text-gray-400">{emp.phone}</div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <span className="inline-block px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wide">
                                                        {emp.division.name}
                                                    </span>
                                                    <div className="text-xs text-gray-500 mt-1">{emp.position}</div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button onClick={() => handleEdit(emp)} className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs font-bold">Edit</button>
                                                    <button onClick={() => confirmDelete(emp.id)} className="p-2 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg text-xs font-bold">Hapus</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center items-center gap-2 mt-4 pb-8">
                            {pagination && pagination.last_page > 0 ? (
                                [...Array(pagination.last_page)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setParams({ search, division_id: filterDivision, page: String(i + 1) })}
                                        className={`min-w-9 h-9 rounded-lg font-bold text-sm transition-all cursor-pointer shadow-sm ${Number(page) === i + 1 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-gray-700'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))
                            ) : (
                                <button className="min-w-9 h-9 rounded-lg font-bold text-sm bg-blue-600 text-white shadow-sm">1</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
                    <div className="relative bg-white dark:bg-gray-900 w-full max-w-xs rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in-95">
                        <h3 className="text-lg font-bold dark:text-white mb-2">Hapus Data?</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Tindakan ini tidak dapat dibatalkan.</p>
                        <div className="flex gap-2">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm cursor-pointer">Batal</button>
                            <button onClick={executeDelete} className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-600 cursor-pointer">Ya, Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}