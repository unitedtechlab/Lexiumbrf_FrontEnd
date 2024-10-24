"use client";

import React, { useState } from "react";
import { Col, Row, Divider, Form, Input, Button, message, Checkbox } from "antd";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import GoogleImg from "@/app/assets/images/google.png";
import MicrosoftImg from "@/app/assets/images/Microsoft.png";
import classes from "../auth.module.css";
import Content from "@/app/components/AuthContent/content";
import { BaseURL } from "@/app/constants/index";
import { useEmail } from "@/app/context/emailContext";
import { setToken, removeToken, getToken, refreshToken } from "@/utils/auth";
import axios from "axios";
import InviteModal from "@/app/modals/invite-user/invite-user";
import { jwtDecode } from "jwt-decode";

interface SignInFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

export default function SignIn() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setEmail } = useEmail();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleInviteResponse = async (isAccepted: boolean) => {
    const inviteResponse = isAccepted ? "true" : "false";

    try {
      let token = getToken();
      if (!token) {
        // token = await refreshToken();  // Refresh the token if not available
        console.log("Token refreshed:", token);
      }

      const response = await axios.put(
        `${BaseURL}/enterprise_users`,
        {
          inviteResponse: inviteResponse,
          accountID: 23,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        message.success(isAccepted ? "Invite accepted." : "Invite declined.");
        if (isAccepted) {
          router.push("/dashboard");
        } else {
          removeToken();
          router.push("/login");
        }
      } else {
        message.error("Failed to update invite response.");
      }

    } catch (error) {
      message.error("An error occurred while processing the invite response.");
    }
  };


  const handleAccept = () => handleInviteResponse(true);
  const handleDecline = () => handleInviteResponse(false);

  const handleCloseModal = () => {
    localStorage.clear();
    removeToken();
    router.push("/signin");
    setIsModalVisible(false);
  }

  const handleSignIn = async (values: SignInFormValues) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BaseURL}/users/login`,
        { email: values.email, password: values.password },
        { headers: { "Content-Type": "application/json" } }
      );

      setLoading(false);
      if (response.data.success) {
        const { token, message: successMessage } = response.data.data;
        setToken(token);
        setEmail(values.email);
        router.push("/dashboard");

        console.log("login token:", token);

      } else {
        message.error(response.data.error?.message || "Signin failed. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      message.error("An error occurred while signing in. Please try again.");
    }
  };
  const handleGoogleSignIn = () => {
    window.location.href = `${BaseURL}/users/provider-login`;
  };

  const handleMicrosoftSignIn = () => {
    window.location.href = `${BaseURL}/auth/microsoft`;
  };

  return (
    <div className={`${classes.loginWrapper} flex`}>
      <div className="container-fluid">
        <Row gutter={16} className={classes.centerform}>
          <Col md={12} sm={24}>
            <Content
              heading="Welcome Back"
              description="Sign in to access your data and continue leveraging the power of Lexium BRF's analytics and insights."
            />
          </Col>
          <Col md={12} sm={24}>
            <div className={classes.loginForm}>
              <div className={classes.formHeading}>
                <span className={classes.head}>Lexium BRF</span>
                <h5>Welcome Back 👋</h5>
                <p>Enter your credentials to access your account</p>
              </div>
              <div className={`flex ${classes.googleMicrosoft}`}>
                <Button
                  className={classes.btnGoogle}
                  onClick={handleGoogleSignIn}
                >
                  <Image
                    src={GoogleImg}
                    alt="Google Icon"
                    width="20"
                    height="20"
                    priority
                  />
                  Login with Google
                </Button>
                <Button
                  className={classes.btnGoogle}
                  onClick={handleMicrosoftSignIn}
                >
                  <Image
                    src={MicrosoftImg}
                    alt="Microsoft Icon"
                    width="20"
                    height="20"
                    priority
                  />
                  Login with Microsoft
                </Button>
              </div>
              <Divider>OR</Divider>
              <Form
                layout="vertical"
                autoComplete="off"
                scrollToFirstError
                onFinish={handleSignIn}
                form={form}
                initialValues={{ remember: true }}
                id="signin-form"
              >
                <Row gutter={16}>
                  <Col md={24} sm={24} xs={24}>
                    <Form.Item
                      name="email"
                      label="E-mail"
                      rules={[
                        { type: "email", message: "The input is not a valid E-mail!" },
                        { required: true, message: "Please enter your E-mail!" },
                      ]}
                    >
                      <Input placeholder="Email ID" id="email" />
                    </Form.Item>
                  </Col>
                  <Col md={24} sm={24} xs={24}>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        { required: true, message: "Please enter your password!" },
                        { min: 8, message: "Password must be at least 8 characters" },
                      ]}
                    >
                      <Input.Password placeholder="Password" id="password" />
                    </Form.Item>
                  </Col>
                  <Col md={24} sm={24} xs={24}>
                    <div className="flex forgot-pass">
                      <Link href="/forgot-password">Forget your password?</Link>
                    </div>
                    <Form.Item
                      name="remember"
                      valuePropName="checked"
                      className="custom-checkbox"
                    >
                      <Checkbox id="remember">Remember me</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col md={24} sm={24} xs={24}>
                    <Form.Item className="mb-1">
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="btn full-width"
                        loading={loading}
                      >
                        Sign In
                      </Button>
                    </Form.Item>
                    <Form.Item className="mb-0">
                      Don't have an account?{" "}
                      <Link href="/signup" className={classes.link}>
                        Sign up
                      </Link>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
        </Row>
      </div>

      <div className="customModalWrapper">
        <InviteModal
          isModalVisible={isModalVisible}
          onClose={handleCloseModal}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      </div>
    </div>
  );
}
