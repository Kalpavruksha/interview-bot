import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Form, Input, Button, Card } from 'antd'
import { toast } from 'react-hot-toast'
import { validateCandidate } from '../utils/validation'

const CandidateInfoForm = ({ onComplete }) => {
  const { currentCandidate } = useSelector(state => state.interview)
  const [form] = Form.useForm()
  const [errors, setErrors] = useState({})
  
  useEffect(() => {
    form.setFieldsValue({
      name: currentCandidate?.name || '',
      email: currentCandidate?.email || '',
      phone: currentCandidate?.phone || ''
    })
  }, [currentCandidate, form])
  
  const onFinish = (values) => {
    // Validate with Zod
    const validation = validateCandidate(values)
    
    if (validation.success) {
      onComplete({
        ...currentCandidate,
        ...validation.data
      })
      toast.success('Information saved successfully!')
    } else {
      setErrors(validation.errors)
      toast.error('Please check the form for errors.')
    }
  }
  
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
    toast.error('Please check the form for errors.')
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Your Information</h2>
      <p className="text-gray-600 mb-6">
        We couldn't extract all required information from your resume. Please fill in the missing details.
      </p>
      
      <Card>
        <Form
          form={form}
          name="candidateInfo"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label="Full Name"
            name="name"
            validateStatus={errors.name ? 'error' : ''}
            help={errors.name}
          >
            <Input placeholder="John Doe" />
          </Form.Item>
          
          <Form.Item
            label="Email Address"
            name="email"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email}
          >
            <Input placeholder="john.doe@example.com" />
          </Form.Item>
          
          <Form.Item
            label="Phone Number"
            name="phone"
            validateStatus={errors.phone ? 'error' : ''}
            help={errors.phone}
          >
            <Input placeholder="+1 (555) 123-4567" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              Start Interview
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default CandidateInfoForm