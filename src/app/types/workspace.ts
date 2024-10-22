export interface RoleData {
    key: string;
    functionality: string;
    adminRead: boolean;
    adminWrite: boolean;
    userRead: boolean;
    userWrite: boolean;
}

export interface RoleManagementModalProps {
    isModalOpen: boolean;
    onClose: () => void;
    workspaceId: string | null;
}
