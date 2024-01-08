package com.orbitelco.inventory.data.common;

import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.sql.Connection;
import javax.sql.DataSource;
import java.sql.SQLException;

@Service
public class DatabaseConnectionTester {

    private final DataSource dataSource;

    public DatabaseConnectionTester(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @PostConstruct
    public void testConnection() {
        try (Connection conn = dataSource.getConnection()) {
            // Connection is successful
        } catch (SQLException e) {
            // Handle the connection error
            System.out.println("Test Database connection error at startup: " + e.getMessage());
        }
    }
}
