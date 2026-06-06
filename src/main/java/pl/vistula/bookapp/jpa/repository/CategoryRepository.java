package pl.vistula.bookapp.jpa.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import pl.vistula.bookapp.jpa.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
