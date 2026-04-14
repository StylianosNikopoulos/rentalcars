package com.example.rentalcars;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RentalcarsApplication {

	public static void main(String[] args) {
		SpringApplication.run(RentalcarsApplication.class, args);
	}

}
