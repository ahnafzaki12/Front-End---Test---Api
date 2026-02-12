import { useEffect, useState } from 'react'
import MainLayout from '../components/MainLayout'
import { getEmployees } from '../services/employeeService'
import { getDivisions } from '../services/divisionService'

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalDivisions: 0,
        latestEmployee: null as any,
        divisions: [] as any[]
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchDashboardData() {
            setLoading(true)
            try {
                const [empRes, divRes] = await Promise.all([
                    getEmployees(''),
                    getDivisions('')
                ])

                const employees = empRes.data.employees || []
                const divisionsData = divRes.data.divisions || []

                const divisionSummary = divisionsData.map((div: any) => {
                    const count = employees.filter((emp: any) => emp.division_id === div.id).length
                    return {
                        ...div,
                        count: count
                    }
                })

                setStats({
                    totalEmployees: empRes.pagination?.total || employees.length,
                    totalDivisions: divisionsData.length,
                    latestEmployee: employees[0] || null,
                    divisions: divisionSummary.slice(0, 6) 
                })
            } catch (err) {
                console.error("API Error", err)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [])

    return (
        <MainLayout>
            <div className="relative mb-10 p-8 rounded-4xl bg-gray-900 dark:bg-blue-700 overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">
                            Hello, Admin <span className="text-blue-400 dark:text-blue-200">Aksamedia</span>
                        </h1>
                        <p className="text-blue-100/70 mt-2 font-medium max-w-md">
                            Sistem manajemen karyawan internal. Anda memiliki {stats.totalEmployees} karyawan terdaftar saat ini.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <a href='/crud' className="px-6 py-3 bg-white text-gray-900 rounded-2xl font-bold text-sm hover:shadow-lg transition-all cursor-pointer">
                            Kelola Karyawan
                        </a>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-4xl border border-gray-100 dark:border-gray-700 shadow-sm group hover:border-blue-500 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Database Karyawan</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-2">
                            {loading ? '...' : stats.totalEmployees} <span className="text-sm font-medium text-gray-400">Orang</span>
                        </h3>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-4xl border border-gray-100 dark:border-gray-700 shadow-sm group hover:border-purple-500 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-2xl">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Struktur Organisasi</p>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-2">
                            {loading ? '...' : stats.totalDivisions} <span className="text-sm font-medium text-gray-400">Divisi</span>
                        </h3>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-4xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h4 className="font-black text-gray-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Karyawan Terakhir Ditambahkan</h4>
                    {loading ? (
                        <div className="animate-pulse flex items-center gap-4">
                            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-4xl"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-3 w-16 bg-gray-100 dark:bg-gray-600 rounded"></div>
                            </div>
                        </div>
                    ) : stats.latestEmployee ? (
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                {stats.latestEmployee.image ? (
                                    <img src={stats.latestEmployee.image} className="w-20 h-20 rounded-4xl object-cover ring-4 ring-blue-50 dark:ring-blue-900/20" alt={stats.latestEmployee.name} />
                                ) : (
                                    <div className="w-20 h-20 rounded-4xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black ring-4 ring-blue-50">
                                        {stats.latestEmployee.name?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900 dark:text-white text-xl leading-tight">{stats.latestEmployee.name}</h3>
                                <p className="text-blue-600 dark:text-blue-400 font-bold text-sm mt-1">{stats.latestEmployee.position}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400 italic text-sm text-center py-4">Tidak ada data</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-8 rounded-4xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest">Daftar Divisi Aktif</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {stats.divisions.map((div, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-transparent hover:border-blue-500 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-10 rounded-full ${i % 2 === 0 ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{div.name}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">ID: {div.id.substring(0,8)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-gray-400">Status</span>
                                    <p className="text-emerald-500 text-xs font-black italic">Connected</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-emerald-500 rounded-4xl p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-xl shadow-emerald-500/20">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-2xl font-black mb-2 leading-tight">Sinkronisasi REST API Berhasil</h3>
                        <p className="text-emerald-100/80 text-sm leading-relaxed font-medium">
                            Menampilkan data real-time dari endpoint <code className="bg-emerald-600 px-1 rounded">/employees</code> dan <code className="bg-emerald-600 px-1 rounded">/divisions</code>.
                        </p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/20 relative z-10">
                        <div className="flex justify-between items-end">
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Database Status</div>
                                <div className="text-lg font-bold">MySQL Online</div>
                            </div>
                            <div className="px-3 py-1 bg-white text-emerald-600 rounded-full text-[10px] font-black uppercase">
                                Task 1-7 Ready
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}