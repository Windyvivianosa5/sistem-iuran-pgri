import AppAdminLayoutTemplate from '@/layouts/app/app-sidebar-admin-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppAdminLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppAdminLayoutProps) => (
    <AppAdminLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppAdminLayoutTemplate>
);
