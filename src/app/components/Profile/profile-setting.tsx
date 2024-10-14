import { Avatar, Button, Image, Input, Modal, Tabs } from 'antd';
import React, { useState } from 'react';
import classes from './profile.module.css';
import userImage from '@/app/assets/images/user.png';

const { TabPane } = Tabs;

interface ProfileSettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsModalProps> = ({ visible, onClose }) => {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            style={{ height: '900px' }} bodyStyle={{ height: '1000px' }}
        >
            <div>
                <div className={classes.profileHeader}>
                    <div >
                        <Avatar size="small" src={<Image src={"userImage"} alt="Marci Fumons" width={45} height={45} />} />
                    </div>
                    <div className={classes.profileInfo}>
                        <h3>Marci Fumons</h3>
                        <p>@marci</p>
                    </div>
                </div>

                <Tabs activeKey={activeTab} onChange={(activeKey) => setActiveTab(activeKey)}>
                    <TabPane tab="General" key="general">
                        {activeTab === 'general' && (
                            <div className={classes.generalTab}>
                                <label>Name:</label>
                                <div className={classes.name_fields}>
                                    <Input type="text" placeholder="First Name" defaultValue="Marci" />
                                    <Input type="text" placeholder="Last Name" defaultValue="Fumons" />
                                </div>
                                <div className={classes.customDivider} />

                                <label>Email:</label>
                                <Input type="email" placeholder="e.g. Linear" />
                                <div className={classes.customDivider} />

                                <div className={classes.profileImage}>
                                    <label>Profile Image:</label>
                                    <Image className={classes.profileImgReplace} src={"userImage"} alt="user image" width={48} height={48} />
                                    <Button >Click to replace</Button>
                                </div>
                            </div>
                        )}
                    </TabPane>
                    <TabPane tab="Security" key="security">
                        {activeTab === 'security' && (
                            <div className={classes.securityTab}>
                                <label>Email:</label>
                                <Input type="email" defaultValue="marci_fu@lexium.co.in" />
                                <div className={classes.customDivider} /> {/* Custom CSS Divider */}

                                <label>Old Password:</label>
                                <Input type="password" placeholder="**********" />
                                <div className={classes.customDivider} /> {/* Custom CSS Divider */}

                                <label>New Password:</label>
                                <Input type="password" placeholder="**********" />
                                <div className={classes.customDivider} /> {/* Custom CSS Divider */}

                                <label>Confirm Password:</label>
                                <Input type="password" placeholder="**********" />
                            </div>
                        )}
                    </TabPane>
                </Tabs>

                <div className={classes.modalFooter}>
                    <Button className={classes.doneBtn} onClick={onClose}>Done</Button>
                </div>
            </div>
        </Modal>
    );
};

export default ProfileSettings;
