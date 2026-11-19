package com.handbook.web;

import jakarta.servlet.jsp.JspException;
import jakarta.servlet.jsp.JspWriter;
import jakarta.servlet.jsp.tagext.SimpleTagSupport;
import java.io.IOException;
import java.text.NumberFormat;
import java.util.Locale;

public class FormatCurrencyTag extends SimpleTagSupport {

    private double amount;
    private String currencyCode = "USD";

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    @Override
    public void doTag() throws JspException, IOException {
        JspWriter out = getJspContext().getOut();
        Locale locale = "EUR".equalsIgnoreCase(currencyCode) ? Locale.GERMANY : Locale.US;
        NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);
        out.print(formatter.format(amount));
    }
}
