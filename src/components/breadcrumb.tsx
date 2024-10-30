'use client'

import { usePathname } from 'next/navigation'
import { HomeIcon } from 'lucide-react'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from 'react'

export default function BreadcrumbComponent() {
    const pathname = usePathname()

    const generateBreadcrumbs = () => {
        const paths = pathname.split('/').filter(path => path)
        const breadcrumbs = [{ href: '/', label: 'Home' }]

        paths.forEach((path, index) => {
            const href = `/${paths.slice(0, index + 1).join('/')}`
            let label = path.charAt(0).toUpperCase() + path.slice(1)

            // Custom labels for specific paths
            if (path === 'medicines') label = 'Medicamentos'
            if (path === 'prescriptions') label = 'Prescrições'
            if (path === 'dependents') label = 'Dependentes'

            breadcrumbs.push({ href, label })
        })

        return breadcrumbs
    }

    const breadcrumbs = generateBreadcrumbs()

    return (
        <Breadcrumb className='ml-4 mt-1'>
            <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={breadcrumb.href}>
                        <BreadcrumbItem>
                            {index === 0 ? (
                                <BreadcrumbLink href={breadcrumb.href} className="flex items-center">
                                    <HomeIcon className="mr-2 h-4 w-4" />
                                    {breadcrumb.label}
                                </BreadcrumbLink>
                            ) : index === breadcrumbs.length - 1 ? (
                                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={breadcrumb.href} className="capitalize">
                                    {breadcrumb.label}
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}