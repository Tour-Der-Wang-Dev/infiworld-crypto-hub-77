
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/common/SEO";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Checkbox } from "@/components/ui/checkbox";

// Form schema
const formSchema = z.object({
  documentType: z.enum(["id_card", "passport"], {
    required_error: "Please select a document type",
  }),
  documentFile: z.instanceof(FileList, {
    message: "Please upload a valid document file",
  }).refine((files) => files.length === 1, {
    message: "Please upload exactly one file",
  }).refine(
    (files) => {
      const file = files[0];
      const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      return validTypes.includes(file.type);
    }, 
    {
      message: "File must be PDF, JPG, or PNG format",
    }
  ).refine(
    (files) => {
      const file = files[0];
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      return file.size <= MAX_FILE_SIZE;
    },
    {
      message: "File size must be less than 5MB",
    }
  ),
  agreement: z.boolean().refine((value) => value === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type FormValues = z.infer<typeof formSchema>;

type VerificationStatus = {
  status: string;
  documentType: string;
  createdAt: string;
  rejectionReason?: string;
};

const Verification = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // SEO Schema for KYC verification page
  const verificationSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "ID Verification - INFIWORLD",
    "description": "Verify your identity on INFIWORLD to access all platform features. Secure and compliant with data protection regulations.",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://infiworld.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "ID Verification",
          "item": "https://infiworld.com/identity-verification"
        }
      ]
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: "id_card",
      agreement: false,
    },
  });

  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      
      if (session?.user) {
        const { data: verification, error } = await supabase
          .from('verifications')
          .select('status, document_type, created_at, rejection_reason')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (verification && !error) {
          setVerificationStatus({
            status: verification.status,
            documentType: verification.document_type === 'id_card' ? 'ID Card' : 'Passport',
            createdAt: new Date(verification.created_at).toLocaleDateString(),
            rejectionReason: verification.rejection_reason || undefined,
          });
        }
      }
    };
    
    checkSession();
  }, []);

  const onSubmit = async (values: FormValues) => {
    if (!isLoggedIn) {
      toast.error("Please login to submit verification documents");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Your session has expired. Please login again.");
        setIsSubmitting(false);
        return;
      }
      
      const userId = session.user.id;
      const file = values.documentFile[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${values.documentType}_${Date.now()}.${fileExt}`;
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('verification_documents')
        .upload(fileName, file);
        
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      
      // Save verification record in database
      const { data: verificationData, error: verificationError } = await supabase
        .from('verifications')
        .insert([{
          user_id: userId,
          document_type: values.documentType,
          document_path: fileName,
          status: 'pending',
        }])
        .select();
        
      if (verificationError) {
        throw new Error(verificationError.message);
      }
      
      // Update UI
      setVerificationStatus({
        status: 'pending',
        documentType: values.documentType === 'id_card' ? 'ID Card' : 'Passport',
        createdAt: new Date().toLocaleDateString(),
      });
      
      toast.success("Document uploaded successfully");
      form.reset();
      
    } catch (error) {
      console.error("Error submitting verification:", error);
      toast.error("Failed to upload document. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Approved</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-sm">
            <XCircle className="h-4 w-4" />
            <span>Rejected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-sm">
            <Clock className="h-4 w-4" />
            <span>Pending</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="ID Verification - INFIWORLD | ยืนยันตัวตนด้วยเอกสาร"
        description="ยืนยันตัวตนของคุณด้วยบัตรประชาชนหรือพาสปอร์ตเพื่อเข้าถึงฟีเจอร์ทั้งหมดบน INFIWORLD อย่างปลอดภัย"
        keywords="ยืนยันตัวตน, KYC, INFIWORLD, บัตรประชาชน, พาสปอร์ต, การยืนยันตัวตนออนไลน์"
        canonicalPath="/identity-verification"
        schemaMarkup={verificationSchema}
      />
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">ID Verification</h1>
        
        {verificationStatus ? (
          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>
                Your verification request submitted on {verificationStatus.createdAt}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  {renderStatusBadge(verificationStatus.status)}
                </div>
                <div>
                  <span className="font-medium">Document Type:</span>
                  <span className="ml-2">{verificationStatus.documentType}</span>
                </div>
                {verificationStatus.rejectionReason && (
                  <div>
                    <span className="font-medium text-red-600">Rejection Reason:</span>
                    <p className="mt-1 text-sm border-l-4 border-red-200 pl-3 py-1">
                      {verificationStatus.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {verificationStatus.status === 'rejected' && (
                <Button onClick={() => setVerificationStatus(null)}>
                  Submit New Document
                </Button>
              )}
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Upload Verification Document</CardTitle>
              <CardDescription>
                Please upload a clear copy of your ID card or passport
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isLoggedIn ? (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-4">
                  <p className="text-amber-700">
                    Please login to submit verification documents.
                  </p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="documentType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Document Type</FormLabel>
                          <FormControl>
                            <div className="flex gap-4">
                              <label className="flex items-center space-x-2">
                                <Input 
                                  type="radio" 
                                  name="documentType"
                                  value="id_card"
                                  checked={field.value === "id_card"}
                                  onChange={() => field.onChange("id_card")}
                                  className="h-4 w-4"
                                  aria-label="Select ID Card as document type"
                                />
                                <span>ID Card</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <Input 
                                  type="radio" 
                                  name="documentType"
                                  value="passport"
                                  checked={field.value === "passport"}
                                  onChange={() => field.onChange("passport")}
                                  className="h-4 w-4"
                                  aria-label="Select Passport as document type"
                                />
                                <span>Passport</span>
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="documentFile"
                      render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Upload Document</FormLabel>
                          <FormControl>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
                              <Upload className="h-10 w-10 text-gray-400 mb-2" aria-hidden="true" />
                              <p className="mb-2 text-sm text-gray-600">
                                PDF, JPG or PNG (max 5MB)
                              </p>
                              <Input
                                {...fieldProps}
                                id="documentFile"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  onChange(e.target.files);
                                }}
                                className="hidden"
                                aria-label="Upload verification document"
                              />
                              <label htmlFor="documentFile" className="cursor-pointer">
                                <Button type="button" variant="outline">
                                  <FileText className="mr-2 h-4 w-4" aria-hidden="true" /> 
                                  Select File
                                </Button>
                              </label>
                              {value && value[0] && (
                                <div className="mt-4 text-sm">
                                  <p>Selected: {value[0].name}</p>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agreement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              aria-label="Agree to terms and conditions"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I confirm that the document is valid and belongs to me
                            </FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="bg-infi-green hover:bg-infi-green-hover w-full"
                      disabled={isSubmitting}
                      aria-label="Submit for verification"
                    >
                      {isSubmitting ? "Uploading..." : "Submit for Verification"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        )}
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Verification Process</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <div className="bg-blue-100 text-blue-800 h-10 w-10 rounded-full flex items-center justify-center mb-4">1</div>
              <h3 className="font-medium mb-2">Submit Document</h3>
              <p className="text-sm text-gray-600">Upload a clear, unmodified copy of your ID card or passport.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <div className="bg-blue-100 text-blue-800 h-10 w-10 rounded-full flex items-center justify-center mb-4">2</div>
              <h3 className="font-medium mb-2">Verification Review</h3>
              <p className="text-sm text-gray-600">Our team will review your document within 1-2 business days.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <div className="bg-blue-100 text-blue-800 h-10 w-10 rounded-full flex items-center justify-center mb-4">3</div>
              <h3 className="font-medium mb-2">Get Verified</h3>
              <p className="text-sm text-gray-600">Once approved, you'll have full access to all platform features.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Verification;
