import React, { useEffect, useRef, useState, useMemo } from 'react';

const ApperFileFieldComponent = ({ config, elementId }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  
  const mountedRef = useRef(false);
  const elementIdRef = useRef(elementId);
  const existingFilesRef = useRef([]);

  // Update elementId ref when it changes
  useEffect(() => {
    elementIdRef.current = elementId;
  }, [elementId]);

  // Memoize existingFiles to prevent re-renders and detect actual changes
  const memoizedExistingFiles = useMemo(() => {
    const files = config?.existingFiles || [];
    
    // Return empty array if no files exist
    if (!Array.isArray(files) || files.length === 0) {
      return [];
    }

    // Check if files have actually changed by comparing length and first file's ID
    const currentLength = existingFilesRef.current?.length || 0;
    const newLength = files.length;
    const currentFirstId = existingFilesRef.current?.[0]?.Id || existingFilesRef.current?.[0]?.id;
    const newFirstId = files[0]?.Id || files[0]?.id;

    // If same length and same first file ID, return previous reference
    if (currentLength === newLength && currentFirstId === newFirstId) {
      return existingFilesRef.current;
    }

    return files;
  }, [config?.existingFiles]);

  // Initial Mount Effect
  useEffect(() => {
    const initializeSDK = async () => {
      let attempts = 0;
      const maxAttempts = 50;

      const waitForSDK = () => {
        return new Promise((resolve, reject) => {
          const checkSDK = () => {
            attempts++;
            if (window.ApperSDK?.ApperFileUploader) {
              resolve();
            } else if (attempts >= maxAttempts) {
              reject(new Error('ApperSDK not loaded after 50 attempts'));
            } else {
              setTimeout(checkSDK, 100);
            }
          };
          checkSDK();
        });
      };

      try {
        await waitForSDK();

        const { ApperFileUploader } = window.ApperSDK;
        elementIdRef.current = `file-uploader-${elementId}`;
        
        await ApperFileUploader.FileField.mount(elementIdRef.current, {
          ...config,
          existingFiles: memoizedExistingFiles
        });

        mountedRef.current = true;
        setIsReady(true);
        setError(null);
      } catch (error) {
        console.error('Failed to initialize ApperFileFieldComponent:', error);
        setError(error.message);
        setIsReady(false);
      }
    };

    initializeSDK();

    // Cleanup on component destruction
    return () => {
      try {
        if (mountedRef.current && window.ApperSDK?.ApperFileUploader) {
          window.ApperSDK.ApperFileUploader.FileField.unmount(elementIdRef.current);
        }
        mountedRef.current = false;
        setIsReady(false);
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    };
  }, [elementId, config.fieldName, config.fieldKey, config.tableName]);

  // File Update Effect
  useEffect(() => {
    if (!isReady || !window.ApperSDK?.ApperFileUploader || !config?.fieldKey) {
      return;
    }

    // Deep equality check with JSON.stringify
    const currentFiles = JSON.stringify(existingFilesRef.current);
    const newFiles = JSON.stringify(memoizedExistingFiles);
    
    if (currentFiles === newFiles) {
      return; // No changes, skip update
    }

    try {
      const { ApperFileUploader } = window.ApperSDK;
      
      // Detect format: check for .Id vs .id property
      const needsFormatConversion = memoizedExistingFiles.length > 0 && 
        memoizedExistingFiles[0].hasOwnProperty('Id');
      
      let filesToUpdate = memoizedExistingFiles;
      if (needsFormatConversion) {
        filesToUpdate = ApperFileUploader.toUIFormat(memoizedExistingFiles);
      }

      // Update files or clear field
      if (filesToUpdate.length > 0) {
        ApperFileUploader.FileField.updateFiles(config.fieldKey, filesToUpdate);
      } else {
        ApperFileUploader.FileField.clearField(config.fieldKey);
      }

      // Update reference
      existingFilesRef.current = memoizedExistingFiles;
    } catch (error) {
      console.error('Error updating files:', error);
      setError(error.message);
    }
  }, [memoizedExistingFiles, isReady, config.fieldKey]);

  // Error UI
  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-md bg-red-50">
        <div className="text-red-800 text-sm font-medium">
          File Upload Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!isReady && (
        <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
          <div className="text-gray-600 text-sm">
            Loading file uploader...
          </div>
        </div>
      )}
      <div id={`file-uploader-${elementId}`} className="w-full" />
    </div>
  );
};

export default ApperFileFieldComponent;