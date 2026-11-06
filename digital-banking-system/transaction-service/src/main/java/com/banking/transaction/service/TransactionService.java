package com.banking.transaction.service;

import com.banking.transaction.dto.*;

import java.util.List;

public interface TransactionService {

    TransferResponse initiateTransfer(TransferRequest request);

    TransactionResponse getTransactionByReference(String reference);

    List<TransactionResponse> getTransactions(String status, String type, String search);

    List<TransactionResponse> getAccountTransactions(String accountNumber);

    List<TransactionResponse> getAllTransactions();

    TransferResponse verifyOtp(String reference, String otpCode);

    TransferResponse resendOtp(String reference);

    void processFraudCheckPassed(String reference);

    void processFraudCheckFailed(String reference, String reason);

    void processOtpRequired(String reference);

    void processRefundCompleted(String reference);
}
