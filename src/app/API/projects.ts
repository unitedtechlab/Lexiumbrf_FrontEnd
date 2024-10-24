import axios from 'axios';
import { BaseURL } from '@/app/constants';
import { getToken } from '@/utils/auth';
import { message } from 'antd';

// Interface for Project
export interface Project {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

// Fetch Projects API
export const fetchProjectsAPI = async (workSpaceID: string): Promise<Project[] | null> => {
    try {
        const token = getToken();
        const response = await axios.get(`${BaseURL}/project?account-type=Enterprise&workspaceID=${workSpaceID}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.success) {
            message.success(response.data.message || 'Projects fetched successfully!');
            return response.data.data.data || [];
        } else {
            message.error(response.data.error.message || 'Failed to fetch projects.');
            return null;
        }
    } catch (error) {
        message.error('An error occurred while fetching the projects.');
        return null;
    }
};

// Create Project API
export const createProjectAPI = async (projectName: string, workSpaceID: string): Promise<boolean> => {
    try {
        const token = getToken();
        const response = await axios.post(
            `${BaseURL}/project?account-type=Enterprise`,
            {
                workSpaceID: parseInt(workSpaceID, 10),
                ProjectName: projectName,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.data.success) {
            message.success(response.data.message || 'Project created successfully!');
            return true;
        } else {
            message.error(response.data.error.message || 'Failed to create the project.');
            return false;
        }
    } catch (error) {
        message.error('An error occurred while creating the project.');
        return false;
    }
};
