<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html>
<head>
    <title>${pageTitle}</title>
    <style>
        body { font-family: sans-serif; margin: 2rem; }
        table { border-collapse: collapse; width: 100%; max-width: 600px; }
        th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
        th { background: #f4f4f4; }
    </style>
</head>
<body>
    <h1>${pageTitle}</h1>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Stock</th>
            </tr>
        </thead>
        <tbody>
            <c:forEach var="item" items="${productList}">
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>$${item.price}</td>
                    <td>${item.stockQuantity}</td>
                </tr>
            </c:forEach>
        </tbody>
    </table>
</body>
</html>
